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
import { workspace } from "../workspaces";

export const monitorTag = pgTable("monitor_tag", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .references(() => workspace.id, { onDelete: "cascade" })
    .notNull(),

  name: text("name").notNull(),
  color: text("color").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const monitorTagsToMonitors = pgTable(
  "monitor_tag_to_monitor",
  {
    monitorId: integer("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    monitorTagId: integer("monitor_tag_id")
      .notNull()
      .references(() => monitorTag.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.monitorId, t.monitorTagId] }),
  }),
);

export const monitorTagsToMonitorsRelation = relations(
  monitorTagsToMonitors,
  ({ one }) => ({
    monitor: one(monitor, {
      fields: [monitorTagsToMonitors.monitorId],
      references: [monitor.id],
    }),
    monitorTag: one(monitorTag, {
      fields: [monitorTagsToMonitors.monitorTagId],
      references: [monitorTag.id],
    }),
  }),
);

export const monitorTagRelations = relations(monitorTag, ({ one, many }) => ({
  monitor: many(monitorTagsToMonitors),
  workspace: one(workspace, {
    fields: [monitorTag.workspaceId],
    references: [workspace.id],
  }),
}));
