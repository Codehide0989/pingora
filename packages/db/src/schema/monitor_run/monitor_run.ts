import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp
} from "drizzle-orm/pg-core";
import { monitor } from "../monitors";
import { workspace } from "../workspaces/workspace";

export const monitorRun = pgTable("monitor_run", {
  id: serial("id").primaryKey(),

  workspaceId: integer("workspace_id").references(() => workspace.id),
  monitorId: integer("monitor_id").references(() => monitor.id),

  runnedAt: integer("runned_at", { mode: "timestamp_ms" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});
