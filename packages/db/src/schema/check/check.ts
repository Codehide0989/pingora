import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { monitorMethods } from "../monitors/constants";
import { workspace } from "../workspaces";

export const check = pgTable("check", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  regions: text("regions").default("").notNull(),
  url: text("url", { length: 4096 }).notNull(),
  headers: text("headers").default(""),
  body: text("body").default(""),
  method: text("method", { enum: monitorMethods }).default("GET"),

  countRequests: integer("count_requests").default(1),

  workspaceId: integer("workspace_id").references(() => workspace.id),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});
