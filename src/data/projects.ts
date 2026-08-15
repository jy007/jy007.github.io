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
export const projects: Project[] = [
  {
    title: "示例项目一",
    description: "占位说明文字：这里写一句话介绍这个项目做了什么、为什么值得一看。",
    href: "https://github.com/jy007",
    tags: ["占位"],
  },
  {
    title: "示例项目二",
    description: "占位说明文字：替换为你想展示的真实项目和链接。",
    href: "https://github.com/jy007",
    tags: ["占位"],
  },
];
