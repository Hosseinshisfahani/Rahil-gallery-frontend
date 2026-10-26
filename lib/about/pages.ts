export const aboutPageOrder = [
  "history",
  "founders",
  "mission",
  "clients",
  "contact",
] as const;

export type AboutSlug = (typeof aboutPageOrder)[number];

const aboutPaths: Record<AboutSlug, string> = {
  history: "/about/history",
  founders: "/about/founders",
  mission: "/about/mission",
  clients: "/about/clients",
  contact: "/about/contact",
};

export function aboutPath(slug: AboutSlug) {
  return aboutPaths[slug];
}

export function nextAboutSlug(slug: AboutSlug): AboutSlug {
  const index = aboutPageOrder.indexOf(slug);
  return aboutPageOrder[(index + 1) % aboutPageOrder.length];
}

/** Structural cross-links from the plan. Bodies stay empty until each page’s text arrives. */
export const aboutRelated: Record<AboutSlug, readonly AboutSlug[]> = {
  history: ["founders", "mission"],
  founders: ["history", "mission"],
  mission: ["founders", "clients"],
  clients: ["mission", "contact"],
  contact: ["clients", "founders"],
};
