import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { workspace } from "../workspaces";

export const application = pgTable("application", {
  id: serial("id").primaryKey(),
  name: text("name"), // friendly name for the project
  dsn: text("dsn").unique(), // dsn for the source

  workspaceId: integer("workspace_id").references(() => workspace.id),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});
