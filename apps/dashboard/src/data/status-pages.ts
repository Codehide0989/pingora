export const statusPages = [
  {
    id: 1,
    name: "Pingora Status",
    description: "See our uptime history and status reports.",
    slug: "status",
    favicon: "https://pingora.dev/favicon.ico",
    domain: "status.pingora.dev",
    protected: true,
    showValues: false,
    // NOTE: the worst status of a report
    status: "degraded" as const,
    monitors: [],
  },
];

export type StatusPage = (typeof statusPages)[number];
