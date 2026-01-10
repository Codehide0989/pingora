import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { monitor } from "../monitors";
import { page } from "../pages";
import { workspace } from "../workspaces";

export const maintenance = pgTable("maintenance", {
  id: serial("id").primaryKey(),
  title: text("title", { length: 256 }).notNull(),
  message: text("message").notNull(),

  from: timestamp("from", { mode: "date" }).notNull(),
  to: timestamp("to", { mode: "date" }).notNull(),

  workspaceId: integer("workspace_id").references(() => workspace.id),
  pageId: integer("page_id").references(() => page.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const maintenancesToMonitors = pgTable(
  "maintenance_to_monitor",
  {
    maintenanceId: integer("maintenance_id")
      .notNull()
      .references(() => maintenance.id, { onDelete: "cascade" }),
    monitorId: integer("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.maintenanceId, t.monitorId] }),
  }),
);

export const maintenancesToMonitorsRelations = relations(
  maintenancesToMonitors,
  ({ one }) => ({
    monitor: one(monitor, {
      fields: [maintenancesToMonitors.monitorId],
      references: [monitor.id],
    }),
    maintenance: one(maintenance, {
      fields: [maintenancesToMonitors.maintenanceId],
      references: [maintenance.id],
    }),
  }),
);

export const maintenanceRelations = relations(maintenance, ({ one, many }) => ({
  maintenancesToMonitors: many(maintenancesToMonitors),
  page: one(page, {
    fields: [maintenance.pageId],
    references: [page.id],
  }),
  workspace: one(workspace, {
    fields: [maintenance.workspaceId],
    references: [workspace.id],
  }),
}));
