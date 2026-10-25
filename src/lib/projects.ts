// Merges hand-written projects with GitHub repos tagged `portfolio`.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getOverrides, getReadmeHtml, getRepo, getTaggedRepos, type Repo } from './github';

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  period?: string;
  date: Date;
  featured: boolean;
  highlights: string[];
  demo?: string;
  repo?: Repo;
  /** Present for hand-written projects; rendered with astro:content's render(). */
  entry?: CollectionEntry<'projects'>;
  /** Present for GitHub-only projects (or local ones with an empty body). */
  readmeHtml?: string | null;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const prettify = (name: string) =>
  name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

let cached: Promise<Project[]> | undefined;

export function getProjects(): Promise<Project[]> {
  cached ??= load();
  return cached;
}

async function load(): Promise<Project[]> {
  const [entries, tagged] = await Promise.all([getCollection('projects'), getTaggedRepos()]);
  const claimed = new Set(entries.map((e) => e.data.repo?.toLowerCase()).filter(Boolean));

  const local = await Promise.all(
    entries.map(async (entry): Promise<Project> => {
      const d = entry.data;
      const repo = d.repo ? await getRepo(d.repo) : null;
      const hasBody = Boolean(entry.body?.trim());
      return {
        slug: entry.id,
        title: d.title,
        summary: d.summary,
        tags: d.tags,
        period: d.period,
        date: d.date,
        featured: d.featured,
        highlights: d.highlights,
        demo: d.demo ?? repo?.homepage ?? undefined,
        repo: repo ?? undefined,
        entry,
        readmeHtml: !hasBody && repo ? await getReadmeHtml(repo) : undefined,
      };
    }),
  );

  const fromGithub = await Promise.all(
    tagged
      .filter((r) => !claimed.has(r.fullName.toLowerCase()))
      .map(async (repo): Promise<Project> => {
        const [o, readmeHtml] = await Promise.all([getOverrides(repo), getReadmeHtml(repo)]);
        const topics = repo.topics.filter((t) => t !== 'portfolio').map(prettify);
        return {
          slug: slugify(repo.name),
          title: o.title ?? prettify(repo.name),
          summary: o.summary ?? repo.description ?? 'A project on GitHub.',
          tags: o.tags ?? [repo.language, ...topics].filter((t): t is string => Boolean(t)),
          period: o.period,
          date: new Date(repo.pushedAt),
          featured: o.featured ?? false,
          highlights: o.highlights ?? [],
          demo: o.demo ?? repo.homepage ?? undefined,
          repo,
          readmeHtml,
        };
      }),
  );

  return [...local, ...fromGithub].sort((a, b) => b.date.getTime() - a.date.getTime());
}
