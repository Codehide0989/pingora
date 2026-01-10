import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { monitor, monitorStatus as monitorStatusEnum } from "../monitors";

export const monitorStatusTable = pgTable(
  "monitor_status",
  {
    monitorId: integer("monitor_id")
      .references(() => monitor.id, { onDelete: "cascade" })
      .notNull(),
    region: text("region").default("").notNull(),
    status: text("status", { enum: monitorStatusEnum })
      .default("active")
      .notNull(),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  },
  (table) => {
    return {
      primaryKey: primaryKey({ columns: [table.monitorId, table.region] }),
      monitorStatusIdx: index("monitor_status_idx").on(
        table.monitorId,
        table.region,
      ),
    };
  },
);

export const monitorStatusRelations = relations(
  monitorStatusTable,
  ({ one }) => ({
    monitor: one(monitor, {
      fields: [monitorStatusTable.monitorId],
      references: [monitor.id],
    }),
  }),
);
