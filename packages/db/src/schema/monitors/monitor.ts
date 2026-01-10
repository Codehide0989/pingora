import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { monitorPeriodicity } from "../constants";
import { incidentTable } from "../incidents/incident";
import { maintenancesToMonitors } from "../maintenances";
import { monitorGroup } from "../monitor_groups";
import { monitorStatusTable } from "../monitor_status/monitor_status";
import { monitorTagsToMonitors } from "../monitor_tags";
import { notificationsToMonitors } from "../notifications";
import { page } from "../pages";
import { privateLocationToMonitors } from "../private_locations";
import { monitorsToStatusReport } from "../status_reports";
import { workspace } from "../workspaces/workspace";
import { monitorJobTypes, monitorMethods, monitorStatus } from "./constants";

export const monitor = pgTable("monitor", {
  id: serial("id").primaryKey(),
  jobType: text("job_type", { enum: monitorJobTypes })
    .default("http")
    .notNull(),
  periodicity: text("periodicity", { enum: monitorPeriodicity })
    .default("other")
    .notNull(),
  status: text("status", { enum: monitorStatus }).default("active").notNull(),
  active: boolean("active").default(false),

  regions: text("regions").default("").notNull(),

  url: text("url", { length: 2048 }).notNull(), // URI

  name: text("name", { length: 256 }).default("").notNull(),
  externalName: text("external_name"),
  description: text("description").default("").notNull(),

  headers: text("headers").default(""),
  body: text("body").default(""),
  method: text("method", { enum: monitorMethods }).default("GET"),
  workspaceId: integer("workspace_id").references(() => workspace.id),

  // Custom timeout for this monitor
  timeout: integer("timeout").notNull().default(45000), // in milliseconds

  // Threshold for the monitor to be considered degraded
  degradedAfter: integer("degraded_after"), // in millisecond

  assertions: text("assertions"),

  otelEndpoint: text("otel_endpoint"),

  otelHeaders: text("otel_headers"),

  public: boolean("public").default(false),

  retry: integer("retry").default(3),

  followRedirects: boolean("follow_redirects").default(
    true,
  ),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),

  deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const monitorRelation = relations(monitor, ({ one, many }) => ({
  monitorsToPages: many(monitorsToPages),
  monitorsToStatusReports: many(monitorsToStatusReport),
  monitorTagsToMonitors: many(monitorTagsToMonitors),
  workspace: one(workspace, {
    fields: [monitor.workspaceId],
    references: [workspace.id],
  }),
  monitorsToNotifications: many(notificationsToMonitors),
  maintenancesToMonitors: many(maintenancesToMonitors),
  incidents: many(incidentTable),
  monitorStatus: many(monitorStatusTable),
  privateLocationToMonitors: many(privateLocationToMonitors),
}));

export const monitorsToPages = pgTable(
  "monitors_to_pages",
  {
    monitorId: integer("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    pageId: integer("page_id")
      .notNull()
      .references(() => page.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    order: integer("order").default(0),

    monitorGroupId: integer("monitor_group_id").references(
      () => monitorGroup.id,
      { onDelete: "cascade" },
    ),
    groupOrder: integer("group_order").default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.monitorId, t.pageId] }),
  }),
);

export const monitorsToPagesRelation = relations(
  monitorsToPages,
  ({ one }) => ({
    monitor: one(monitor, {
      fields: [monitorsToPages.monitorId],
      references: [monitor.id],
    }),
    page: one(page, {
      fields: [monitorsToPages.pageId],
      references: [page.id],
    }),
    monitorGroup: one(monitorGroup, {
      fields: [monitorsToPages.monitorGroupId],
      references: [monitorGroup.id],
    }),
  }),
);
