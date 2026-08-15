import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { htmlPostsLoader } from "./lib/loaders/html-posts-loader";

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
  draft: z.boolean().default(false),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: postSchema,
});

const htmlPosts = defineCollection({
  loader: htmlPostsLoader({ base: "./src/content/posts" }),
  schema: postSchema,
});

export const collections = { posts, htmlPosts };
