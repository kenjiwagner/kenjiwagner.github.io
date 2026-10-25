import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Hand-written project pages (src/content/projects/*.md).
// Set `repo` to "owner/name" to attach live GitHub stats and a repo link;
// if that repo is also tagged `portfolio`, it is merged here instead of duplicated.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    period: z.string().optional(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    repo: z.string().optional(),
    demo: z.string().url().optional(),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = { projects };
