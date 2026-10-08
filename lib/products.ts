export type ProductSlug = "ui" | "uim" | "access" | "relay" | "work" | "one";

export type ProductLink = { label: string; path: string };

export type Product = {
  slug: ProductSlug;
  name: string;
  family: "interface" | "platform";
  tagline: string;
  summary: string;
  repository: string;
  /** Sections shown in the product bar and the global menu, relative to /docs/<slug>. */
  sections: ProductLink[];
  status?: "pre-alpha";
};

/** UI's sections: the guides, then one per registry category. */
const uiSections: ProductLink[] = [
  { label: "Docs", path: "" },
  { label: "Components", path: "/components" },
  { label: "Patterns", path: "/patterns" },
  { label: "Interactions", path: "/interactions" },
  { label: "Charts", path: "/charts" },
  { label: "Blocks", path: "/blocks" },
];

const uimSections: ProductLink[] = [
  { label: "Docs", path: "" },
  { label: "Components", path: "/components/button" },
];

const platformSections: ProductLink[] = [
  { label: "Overview", path: "" },
  { label: "Concepts", path: "/concepts" },
  { label: "Guarantees", path: "/guarantees" },
];

const earlySections: ProductLink[] = [
  { label: "Overview", path: "" },
];

export const products: Product[] = [
  {
    slug: "ui",
    name: "UI",
    family: "interface",
    tagline: "Components for the web.",
    summary: "Copy-paste React components with a clean, minimal design, built on Base UI and Tailwind CSS.",
    repository: "https://github.com/e-suiss/ui",
    sections: uiSections,
  },
  {
    slug: "uim",
    name: "UIM",
    family: "interface",
    tagline: "Components for iOS and Android.",
    summary: "The same components for React Native and Expo, styled with Uniwind or NativeWind.",
    repository: "https://github.com/e-suiss/uim",
    sections: uimSections,
  },
  {
    slug: "access",
    name: "Access",
    family: "platform",
    tagline: "Identity and authority.",
    summary: "Open-source identity and authority for people, organizations and AI agents.",
    repository: "https://github.com/e-suiss/access",
    sections: platformSections,
    status: "pre-alpha",
  },
  {
    slug: "relay",
    name: "Relay",
    family: "platform",
    tagline: "Notifications and messaging.",
    summary: "Open-source notification, messaging and event delivery for people, services, devices and AI agents.",
    repository: "https://github.com/e-suiss/relay",
    sections: platformSections,
    status: "pre-alpha",
  },
  {
    slug: "work",
    name: "Work",
    family: "platform",
    tagline: "Coordination of work.",
    summary: "Open-source coordination of work between people, AI agents, systems and machines.",
    repository: "https://github.com/e-suiss/work",
    sections: platformSections,
    status: "pre-alpha",
  },
  {
    slug: "one",
    name: "One",
    family: "platform",
    tagline: "Your personal agent.",
    summary: "A user-owned, model-independent personal agent that persists across devices.",
    repository: "https://github.com/e-suiss",
    sections: earlySections,
    status: "pre-alpha",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
