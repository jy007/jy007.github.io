export interface Project {
  title: string;
  description: string;
  href: string;
  tags?: string[];
}

/**
 * Curated, hand-maintained project list — deliberately not auto-pulled from the
 * GitHub API at build time, since most public repos under jy007 are older academic
 * forks that don't represent current work. Replace these placeholders with the
 * projects you actually want to showcase.
 */
export const projects: Project[] = [];
