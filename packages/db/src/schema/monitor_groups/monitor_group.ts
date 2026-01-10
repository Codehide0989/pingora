import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { page } from "../pages";
import { workspace } from "../workspaces";

export const monitorGroup = pgTable("monitor_group", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .references(() => workspace.id, { onDelete: "cascade" })
    .notNull(),
  pageId: integer("page_id")
    .references(() => page.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});
