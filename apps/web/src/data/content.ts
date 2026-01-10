import {
  getComparePages,
  getProductPages,
  getToolsPages,
} from "@/content/utils";
import type { Region } from "@pingora/regions";

const products = getProductPages();

const productsSection = {
  label: "Products",
  items: products.map((product) => ({
    label: product.metadata.title,
    href: `/${product.slug}`,
  })),
};

const resourcesFooterSection = {
  label: "Resources",
  items: [
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Docs",
      href: `${process.env.NEXT_PUBLIC_DOCS_URL}`,
    },
    {
      label: "External Status",
      href: "/status",
    },
    {
      label: "OSS Friends",
      href: "/oss-friends",
    },
    {
      label: "Marketing V1",
      href: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/v1` : "https://v1.pingora.dev",
    },
  ],
};

const resourcesHeaderSection = {
  label: "Resources",
  items: [
    {
      label: "Docs",
      href: `${process.env.NEXT_PUBLIC_DOCS_URL}`,
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Changelog",
      href: "/changelog",
    },
    {
      label: "Global Speed Checker",
      href: "/play/checker",
    },
    {
      label: "Compare",
      href: "/compare",
    },
  ],
};

const companySection = {
  label: "Company",
  items: [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Changelog",
      href: "/changelog",
    },
    {
      label: "I'm an LLM",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/llms.txt`,
    },
    {
      label: "Terms",
      href: "/terms",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
    {
      label: "Subprocessors",
      href: "/subprocessors",
    },
  ],
};

const compareSection = {
  label: "Compare",
  items: getComparePages().map((page) => ({
    label: page.metadata.title,
    href: `/compare/${page.slug}`,
  })),
};

const toolsSection = {
  label: "Tools",
  items: [
    ...getToolsPages()
      .filter((page) => page.slug !== "checker-slug")
      .map((page) => ({
        label: page.metadata.title,
        href: `/play/${page.slug}`,
      })),
    {
      label: "Theme Explorer",
      href: "https://themes.pingora.dev",
    },
    {
      label: "All Status Codes",
      href: "https://openstat.us",
    },
    {
      label: "Vercel Edge Ping",
      href: "https://light.pingora.dev",
    },
  ],
};

const communitySection = {
  label: "Community",
  items: [
    {
      label: "Discord",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/discord`,
    },
    {
      label: "GitHub",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/github`,
    },
    {
      label: "X",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/twitter`,
    },
    {
      label: "BlueSky",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/bsky`,
    },
    {
      label: "YouTube",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/youtube`,
    },
    {
      label: "LinkedIn",
      href: `${process.env.NEXT_PUBLIC_APP_URL}/linkedin`,
    },
  ],
};

export const playSection = {
  label: "Play",
  items: [
    ...getToolsPages()
      .filter((page) => page.slug !== "checker-slug")
      .map((page) => ({
        label: page.metadata.title,
        href: `/play/${page.slug}`,
      })),
    {
      label: "Theme Explorer",
      href: "https://themes.pingora.dev",
    },
    {
      label: "All Status Codes",
      href: "https://openstat.us",
    },
    {
      label: "Vercel Edge Ping",
      href: "https://light.pingora.dev",
    },
    {
      label: "React Data Table",
      href: "https://logs.run",
    },
    {
      label: "Shadcn Time Picker",
      href: "https://time.pingora.dev",
    },
    {
      label: "Astro Status Page",
      href: "https://astro.openstat.us",
    },
  ],
};

export const headerLinks = [productsSection, resourcesHeaderSection];

export const footerLinks = [
  productsSection,
  resourcesFooterSection,
  companySection,
  compareSection,
  toolsSection,
  communitySection,
];

// --------------------------------

export type RegionMetricsChartTable = {
  region: Region;
  count: number;
  ok: number;
  p50Latency: number | null;
  p75Latency: number | null;
  p90Latency: number | null;
  p95Latency: number | null;
  p99Latency: number | null;
};
