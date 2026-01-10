import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

import { monitor } from "../monitors";
import { notification } from "../notifications";
import { page } from "../pages";
import { usersToWorkspaces } from "../users";
import { workspacePlans } from "./constants";

export const workspace = pgTable(
  "workspace",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(), // we love random words
    name: text("name"),


    plan: text("plan", { enum: workspacePlans }),
    endsAt: timestamp("ends_at", { mode: "date" }),
    paidUntil: timestamp("paid_until", { mode: "date" }),
    limits: text("limits").default("{}").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),

    dsn: text("dsn"), // should be removed soon
  },
  (t) => ({
    unique: unique().on(t.id, t.dsn),
  }),
);

export const workspaceRelations = relations(workspace, ({ many }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  pages: many(page),
  monitors: many(monitor),
  notifications: many(notification),
  // TODO: add checks or monitorRuns
}));
