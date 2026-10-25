// Build-time GitHub fetching. Nothing here runs in the visitor's browser.
// Set GITHUB_TOKEN to raise the API rate limit (the deploy workflow does this).
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { site } from '../site.config';

export interface Repo {
  fullName: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  pushedAt: string;
  createdAt: string;
  defaultBranch: string;
}

// Optional `portfolio.yml` at the root of a repo to customize its page.
export interface RepoOverrides {
  title?: string;
  summary?: string;
  tags?: string[];
  featured?: boolean;
  demo?: string;
  period?: string;
  highlights?: string[];
}

const API = 'https://api.github.com';

function headers(accept = 'application/vnd.github+json') {
  const h: Record<string, string> = { Accept: accept, 'User-Agent': 'portfolio-build' };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function get(url: string, accept?: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { headers: headers(accept) });
    if (res.ok) return res;
    if (res.status !== 404) console.warn(`[github] ${res.status} for ${url}`);
  } catch (err) {
    console.warn(`[github] request failed for ${url}:`, err);
  }
  return null;
}

function toRepo(r: any): Repo {
  return {
    fullName: r.full_name,
    name: r.name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage || null,
    language: r.language,
    topics: r.topics ?? [],
    stars: r.stargazers_count,
    pushedAt: r.pushed_at,
    createdAt: r.created_at,
    defaultBranch: r.default_branch,
  };
}

let tagged: Promise<Repo[]> | undefined;

/** Public, non-fork repos across all configured accounts that carry the portfolio topic. */
export function getTaggedRepos(): Promise<Repo[]> {
  tagged ??= (async () => {
    const all = await Promise.all(
      site.github.users.map(async (user) => {
        const res = await get(`${API}/users/${user}/repos?per_page=100&type=owner`);
        const list: any[] = res ? await res.json() : [];
        return list.filter((r) => !r.fork && r.topics?.includes(site.github.topic)).map(toRepo);
      }),
    );
    return all.flat();
  })();
  return tagged;
}

const repoCache = new Map<string, Promise<Repo | null>>();

export function getRepo(fullName: string): Promise<Repo | null> {
  if (!repoCache.has(fullName)) {
    repoCache.set(
      fullName,
      get(`${API}/repos/${fullName}`).then(async (res) => (res ? toRepo(await res.json()) : null)),
    );
  }
  return repoCache.get(fullName)!;
}

export async function getOverrides(repo: Repo): Promise<RepoOverrides> {
  const res = await get(
    `https://raw.githubusercontent.com/${repo.fullName}/${repo.defaultBranch}/portfolio.yml`,
  );
  if (!res) return {};
  try {
    return (parseYaml(await res.text()) as RepoOverrides) ?? {};
  } catch {
    console.warn(`[github] could not parse portfolio.yml in ${repo.fullName}`);
    return {};
  }
}

/** README rendered to HTML, with relative links pointed back at GitHub. */
export async function getReadmeHtml(repo: Repo): Promise<string | null> {
  const res = await get(`${API}/repos/${repo.fullName}/readme`, 'application/vnd.github.raw');
  if (!res) return null;
  // Drop the leading H1: the page already shows the title.
  const markdown = (await res.text()).replace(/^\s*#\s.+\n/, '');
  const html = await marked.parse(markdown);
  const raw = `https://raw.githubusercontent.com/${repo.fullName}/${repo.defaultBranch}/`;
  const blob = `${repo.url}/blob/${repo.defaultBranch}/`;
  const isRelative = (u: string) => !/^([a-z]+:|#|\/\/)/i.test(u);
  return html
    .replace(/(<img[^>]+src=")([^"]+)"/g, (m, pre, src) =>
      isRelative(src) ? `${pre}${raw}${src.replace(/^\.?\//, '')}"` : m,
    )
    .replace(/(<a[^>]+href=")([^"]+)"/g, (m, pre, href) =>
      isRelative(href) ? `${pre}${blob}${href.replace(/^\.?\//, '')}"` : m,
    );
}
