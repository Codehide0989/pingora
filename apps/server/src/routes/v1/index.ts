import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import type { RequestIdVariables } from "hono/request-id";

import { handleZodError } from "@/libs/errors";
import { authMiddleware } from "@/libs/middlewares";
import type { Workspace } from "@pingora/db/src/schema";
import { checkApi } from "./check";
import { incidentsApi } from "./incidents";
import { maintenancesApi } from "./maintenances";
import { monitorsApi } from "./monitors";
import { notificationsApi } from "./notifications";
import { pageSubscribersApi } from "./pageSubscribers";
import { pagesApi } from "./pages";
import { statusReportUpdatesApi } from "./statusReportUpdates";
import { statusReportsApi } from "./statusReports";
import { whoamiApi } from "./whoami";

export type Variables = RequestIdVariables & {
  workspace: Workspace;
};

export const api = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: handleZodError,
});

api.use("/openapi", cors());

api.openAPIRegistry.registerComponent("securitySchemes", "ApiKeyAuth", {
  type: "apiKey",
  in: "header",
  name: "x-pingora-key",
  "x-pingora-key": "string",
});

api.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Pingora API",
    contact: {
      email: "ping@pingora.dev",
      url: "https://www.pingora.dev",
    },
    description:
      "Pingora is a open-source synthetic monitoring tool that allows you to monitor your website and API's uptime, latency, and more. \n\n The Pingora API allows you to interact with the Pingora platform programmatically. \n\n To get started you need to create an account on https://www.pingora.dev/ and create an api token in your settings.",
  },
  tags: [
    {
      name: "monitor",
      description: "Monitor related endpoints",
      "x-displayName": "Monitor",
    },
    {
      name: "page",
      description: "Page related endpoints",
      "x-displayName": "Page",
    },
    {
      name: "status_report",
      description: "Status report related endpoints",
      "x-displayName": "Status Report",
    },
    {
      name: "status_report_update",
      description: "Status report update related endpoints",
      "x-displayName": "Status Report Update",
    },
    {
      name: "incident",
      description: "Incident related endpoints",
      "x-displayName": "Incident",
    },
    {
      name: "maintenance",
      description: "Maintenance related endpoints",
      "x-displayName": "Maintenance",
    },
    {
      name: "notification",
      description: "Notification related endpoints",
      "x-displayName": "Notification",
    },
    {
      name: "page_subscriber",
      description: "Page subscriber related endpoints",
      "x-displayName": "Page Subscriber",
    },
    {
      name: "check",
      description: "Check related endpoints",
      "x-displayName": "Check",
    },
    {
      name: "whoami",
      description: "WhoAmI related endpoints",
      "x-displayName": "WhoAmI",
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
});

api.get(
  "/",
  Scalar({
    url: "/v1/openapi",
    servers: [
      {
        url: "https://api.pingora.dev/v1",
        description: "Production server",
      },
      {
        url: "http://localhost:3000/v1",
        description: "Dev server",
      },
    ],
    metaData: {
      title: "Pingora API",
      description: "Start building with Pingora API",
      ogDescription: "API Reference",
      ogTitle: "Pingora API",
      ogImage:
        "https://pingora.dev/api/og?title=Pingora%20API&description=API%20Reference",
      twitterCard: "summary_large_image",
    },
  }),
);
/**
 * Middlewares
 */
api.use("/*", authMiddleware);

/**
 * Routes
 */
api.route("/monitor", monitorsApi);
api.route("/page", pagesApi);
api.route("/status_report", statusReportsApi);
api.route("/status_report_update", statusReportUpdatesApi);
api.route("/incident", incidentsApi);
api.route("/maintenance", maintenancesApi);
api.route("/notification", notificationsApi);
api.route("/page_subscriber", pageSubscribersApi);
api.route("/check", checkApi);
api.route("/whoami", whoamiApi);
