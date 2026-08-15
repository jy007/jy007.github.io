import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Loader } from "astro/loaders";

interface HtmlPostsLoaderOptions {
  /** Directory to scan for `*.html` + sibling `*.json` metadata pairs, relative to the project root. */
  base: string;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(entryPath) : Promise.resolve([entryPath]);
    }),
  );
  return nested.flat();
}

/** Content Layer loader for hand-written HTML posts: each post is an `.html` fragment
 * (no <html>/<head>/<body>) paired with a same-named `.json` metadata sidecar, so it
 * renders through the same Zod schema and post layout as Markdown posts. */
export function htmlPostsLoader(options: HtmlPostsLoaderOptions): Loader {
  return {
    name: "html-posts-loader",
    load: async ({ store, config, parseData, generateDigest, logger, watcher }) => {
      const baseDir = fileURLToPath(new URL(options.base, config.root));

      let files: string[];
      try {
        files = await walk(baseDir);
      } catch {
        logger.warn(`html-posts-loader: no directory found at ${baseDir}, skipping.`);
        return;
      }

      const htmlFiles = files.filter((file) => file.endsWith(".html"));
      store.clear();

      for (const htmlPath of htmlFiles) {
        const jsonPath = htmlPath.replace(/\.html$/, ".json");
        const relativePath = path.relative(baseDir, htmlPath).split(path.sep).join("/");
        const id = relativePath.replace(/\.html$/, "").replace(/\/index$/, "");

        let rawData: Record<string, unknown>;
        try {
          rawData = JSON.parse(await readFile(jsonPath, "utf-8"));
        } catch {
          logger.error(
            `html-posts-loader: missing or invalid metadata file "${jsonPath}" for HTML post "${htmlPath}" — skipping.`,
          );
          continue;
        }

        const html = await readFile(htmlPath, "utf-8");
        const data = await parseData({ id, data: rawData, filePath: htmlPath });
        const digest = generateDigest({ data: rawData, html });
        const filePath = path.relative(fileURLToPath(config.root), htmlPath);

        store.set({
          id,
          data,
          body: html,
          filePath,
          digest,
          rendered: { html },
        });

        watcher?.add(htmlPath);
        watcher?.add(jsonPath);
      }

      logger.info(`html-posts-loader: loaded ${htmlFiles.length} HTML post(s).`);
    },
  };
}
