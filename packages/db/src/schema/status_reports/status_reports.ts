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

export const statusReportStatus = [
  "investigating",
  "identified",
  "monitoring",
  "resolved",
] as const;

export const statusReport = pgTable("status_report", {
  id: serial("id").primaryKey(),
  status: text("status", { enum: statusReportStatus }).notNull(),
  title: text("title", { length: 256 }).notNull(),

  workspaceId: integer("workspace_id").references(() => workspace.id),

  pageId: integer("page_id").references(() => page.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const statusReportUpdate = pgTable("status_report_update", {
  id: serial("id").primaryKey(),

  status: text("status", { enum: statusReportStatus }).notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  message: text("message").notNull(),

  statusReportId: integer("status_report_id")
    .references(() => statusReport.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const StatusReportRelations = relations(
  statusReport,
  ({ one, many }) => ({
    monitorsToStatusReports: many(monitorsToStatusReport),
    page: one(page, {
      fields: [statusReport.pageId],
      references: [page.id],
    }),
    statusReportUpdates: many(statusReportUpdate),
    workspace: one(workspace, {
      fields: [statusReport.workspaceId],
      references: [workspace.id],
    }),
  }),
);

export const statusReportUpdateRelations = relations(
  statusReportUpdate,
  ({ one }) => ({
    statusReport: one(statusReport, {
      fields: [statusReportUpdate.statusReportId],
      references: [statusReport.id],
    }),
  }),
);

export const monitorsToStatusReport = pgTable(
  "status_report_to_monitors",
  {
    monitorId: integer("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    statusReportId: integer("status_report_id")
      .notNull()
      .references(() => statusReport.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.monitorId, t.statusReportId] }),
  }),
);

export const monitorsToStatusReportRelations = relations(
  monitorsToStatusReport,
  ({ one }) => ({
    monitor: one(monitor, {
      fields: [monitorsToStatusReport.monitorId],
      references: [monitor.id],
    }),
    statusReport: one(statusReport, {
      fields: [monitorsToStatusReport.statusReportId],
      references: [statusReport.id],
    }),
  }),
);

// FIXME: We might have to drop foreign key constraints for the following tables
// export const pagesToStatusReports = pgTable(
//   "status_reports_to_pages",
//   {
//     pageId: integer("page_id")
//       .notNull()
//       .references(() => page.id, { onDelete: "cascade" }),
//     statusReportId: integer("status_report_id")
//       .notNull()
//       .references(() => statusReport.id, { onDelete: "cascade" }),
//     createdAt: timestamp("created_at", { mode: "date" }).defaultNow()`
//     ),
//   },
//   (t) => ({
//     pk: primaryKey(t.pageId, t.statusReportId),
//   })
// );

// export const pagesToStatusReportsRelations = relations(
//   pagesToStatusReports,
//   ({ one }) => ({
//     page: one(page, {
//       fields: [pagesToStatusReports.pageId],
//       references: [page.id],
//     }),
//     statusReport: one(statusReport, {
//       fields: [pagesToStatusReports.statusReportId],
//       references: [statusReport.id],
//     }),
//   })
// );
