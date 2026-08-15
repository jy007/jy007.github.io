import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts"> | CollectionEntry<"htmlPosts">;

/** Merges the Markdown and HTML post collections into one date-sorted list,
 * hiding drafts outside of local dev. Both collections share the same schema,
 * so callers don't need to care which format a post was authored in. */
export async function getAllPosts(): Promise<Post[]> {
  const [posts, htmlPosts] = await Promise.all([
    getCollection("posts", ({ data }) => import.meta.env.PROD ? !data.draft : true),
    getCollection("htmlPosts", ({ data }) => import.meta.env.PROD ? !data.draft : true),
  ]);

  return [...posts, ...htmlPosts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export function getAllTags(posts: Post[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].sort();
}

export function postUrl(post: Post): string {
  return `/blog/${post.id}/`;
}
