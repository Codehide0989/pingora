import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { monitor } from "../monitors/monitor";
import { workspace } from "../workspaces";

export const privateLocation = pgTable("private_location", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  token: text("token").notNull(),
  lastSeenAt: timestamp("last_seen_at", { mode: "date" }),
  workspaceId: integer("workspace_id").references(() => workspace.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const privateLocationToMonitors = pgTable(
  "private_location_to_monitor",
  {
    privateLocationId: integer("private_location_id").references(
      () => privateLocation.id,
      { onDelete: "cascade" },
    ),
    monitorId: integer("monitor_id").references(() => monitor.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
);

export const privateLocationRelation = relations(
  privateLocation,
  ({ many, one }) => ({
    privateLocationToMonitors: many(privateLocationToMonitors),
    workspace: one(workspace, {
      fields: [privateLocation.workspaceId],
      references: [workspace.id],
    }),
  }),
);

export const privateLocationToMonitorsRelation = relations(
  privateLocationToMonitors,
  ({ one }) => ({
    privateLocation: one(privateLocation, {
      fields: [privateLocationToMonitors.privateLocationId],
      references: [privateLocation.id],
    }),
    monitor: one(monitor, {
      fields: [privateLocationToMonitors.monitorId],
      references: [monitor.id],
    }),
  }),
);
