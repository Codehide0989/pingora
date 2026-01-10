CREATE TABLE "workspace" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text,
	"plan" text,
	"ends_at" timestamp,
	"paid_until" timestamp,
	"limits" text DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"dsn" text,
	CONSTRAINT "workspace_slug_unique" UNIQUE("slug"),
	CONSTRAINT "workspace_id_dsn_unique" UNIQUE("id","dsn")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" text,
	"first_name" text DEFAULT '',
	"last_name" text DEFAULT '',
	"photo_url" text DEFAULT '',
	"name" text,
	"email" text DEFAULT '',
	"emailVerified" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "users_to_workspaces" (
	"user_id" integer NOT NULL,
	"workspace_id" integer NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_to_workspaces_user_id_workspace_id_pk" PRIMARY KEY("user_id","workspace_id")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" integer NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "status_report_to_monitors" (
	"monitor_id" integer NOT NULL,
	"status_report_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "status_report_to_monitors_monitor_id_status_report_id_pk" PRIMARY KEY("monitor_id","status_report_id")
);
--> statement-breakpoint
CREATE TABLE "status_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"title" text NOT NULL,
	"workspace_id" integer,
	"page_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "status_report_update" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"date" timestamp NOT NULL,
	"message" text NOT NULL,
	"status_report_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"workspace_id" integer,
	"credential" text,
	"external_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"data" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT '',
	"slug" text NOT NULL,
	"custom_domain" text NOT NULL,
	"published" boolean DEFAULT false,
	"force_theme" text DEFAULT 'system' NOT NULL,
	"password" text,
	"password_protected" boolean DEFAULT false,
	"access_type" text DEFAULT 'public',
	"auth_email_domains" text,
	"homepage_url" text,
	"contact_url" text,
	"legacy_page" boolean DEFAULT true NOT NULL,
	"configuration" text,
	"show_monitor_values" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "monitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_type" text DEFAULT 'http' NOT NULL,
	"periodicity" text DEFAULT 'other' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"active" boolean DEFAULT false,
	"regions" text DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"external_name" text,
	"description" text DEFAULT '' NOT NULL,
	"headers" text DEFAULT '',
	"body" text DEFAULT '',
	"method" text DEFAULT 'GET',
	"workspace_id" integer,
	"timeout" integer DEFAULT 45000 NOT NULL,
	"degraded_after" integer,
	"assertions" text,
	"otel_endpoint" text,
	"otel_headers" text,
	"public" boolean DEFAULT false,
	"retry" integer DEFAULT 3,
	"follow_redirects" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "monitors_to_pages" (
	"monitor_id" integer NOT NULL,
	"page_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"order" integer DEFAULT 0,
	"monitor_group_id" integer,
	"group_order" integer DEFAULT 0,
	CONSTRAINT "monitors_to_pages_monitor_id_page_id_pk" PRIMARY KEY("monitor_id","page_id")
);
--> statement-breakpoint
CREATE TABLE "page_subscriber" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"page_id" integer NOT NULL,
	"token" text,
	"accepted_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" text NOT NULL,
	"data" text DEFAULT '{}',
	"workspace_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_trigger" (
	"id" serial PRIMARY KEY NOT NULL,
	"monitor_id" integer,
	"notification_id" integer,
	"cron_timestamp" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications_to_monitors" (
	"monitor_id" integer NOT NULL,
	"notification_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "notifications_to_monitors_monitor_id_notification_id_pk" PRIMARY KEY("monitor_id","notification_id")
);
--> statement-breakpoint
CREATE TABLE "monitor_status" (
	"monitor_id" integer NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "monitor_status_monitor_id_region_pk" PRIMARY KEY("monitor_id","region")
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"workspace_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"accepted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "incident" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'triage' NOT NULL,
	"monitor_id" integer,
	"workspace_id" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"acknowledged_by" integer,
	"resolved_at" timestamp,
	"resolved_by" integer,
	"incident_screenshot_url" text,
	"recovery_screenshot_url" text,
	"auto_resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "incident_monitor_id_started_at_unique" UNIQUE("monitor_id","started_at")
);
--> statement-breakpoint
CREATE TABLE "monitor_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monitor_tag_to_monitor" (
	"monitor_id" integer NOT NULL,
	"monitor_tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "monitor_tag_to_monitor_monitor_id_monitor_tag_id_pk" PRIMARY KEY("monitor_id","monitor_tag_id")
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"dsn" text,
	"workspace_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "application_dsn_unique" UNIQUE("dsn")
);
--> statement-breakpoint
CREATE TABLE "maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"from" timestamp NOT NULL,
	"to" timestamp NOT NULL,
	"workspace_id" integer,
	"page_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_to_monitor" (
	"maintenance_id" integer NOT NULL,
	"monitor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "maintenance_to_monitor_maintenance_id_monitor_id_pk" PRIMARY KEY("maintenance_id","monitor_id")
);
--> statement-breakpoint
CREATE TABLE "check" (
	"id" integer PRIMARY KEY NOT NULL,
	"regions" text DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"headers" text DEFAULT '',
	"body" text DEFAULT '',
	"method" text DEFAULT 'GET',
	"count_requests" integer DEFAULT 1,
	"workspace_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monitor_run" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer,
	"monitor_id" integer,
	"runned_at" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "private_location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"token" text NOT NULL,
	"last_seen_at" timestamp,
	"workspace_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "private_location_to_monitor" (
	"private_location_id" integer,
	"monitor_id" integer,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "monitor_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"page_id" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "viewer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "viewer_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "viewer_accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "viewer_accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "viewer_session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"prefix" text NOT NULL,
	"hashed_token" text NOT NULL,
	"workspace_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"last_used_at" timestamp,
	CONSTRAINT "api_key_prefix_unique" UNIQUE("prefix"),
	CONSTRAINT "api_key_hashed_token_unique" UNIQUE("hashed_token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_report_to_monitors" ADD CONSTRAINT "status_report_to_monitors_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_report_to_monitors" ADD CONSTRAINT "status_report_to_monitors_status_report_id_status_report_id_fk" FOREIGN KEY ("status_report_id") REFERENCES "public"."status_report"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_report" ADD CONSTRAINT "status_report_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_report" ADD CONSTRAINT "status_report_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_report_update" ADD CONSTRAINT "status_report_update_status_report_id_status_report_id_fk" FOREIGN KEY ("status_report_id") REFERENCES "public"."status_report"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration" ADD CONSTRAINT "integration_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor" ADD CONSTRAINT "monitor_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitors_to_pages" ADD CONSTRAINT "monitors_to_pages_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitors_to_pages" ADD CONSTRAINT "monitors_to_pages_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitors_to_pages" ADD CONSTRAINT "monitors_to_pages_monitor_group_id_monitor_group_id_fk" FOREIGN KEY ("monitor_group_id") REFERENCES "public"."monitor_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_subscriber" ADD CONSTRAINT "page_subscriber_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_trigger" ADD CONSTRAINT "notification_trigger_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_trigger" ADD CONSTRAINT "notification_trigger_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_to_monitors" ADD CONSTRAINT "notifications_to_monitors_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_to_monitors" ADD CONSTRAINT "notifications_to_monitors_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_status" ADD CONSTRAINT "monitor_status_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE set default ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_acknowledged_by_user_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_tag" ADD CONSTRAINT "monitor_tag_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_tag_to_monitor" ADD CONSTRAINT "monitor_tag_to_monitor_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_tag_to_monitor" ADD CONSTRAINT "monitor_tag_to_monitor_monitor_tag_id_monitor_tag_id_fk" FOREIGN KEY ("monitor_tag_id") REFERENCES "public"."monitor_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_to_monitor" ADD CONSTRAINT "maintenance_to_monitor_maintenance_id_maintenance_id_fk" FOREIGN KEY ("maintenance_id") REFERENCES "public"."maintenance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_to_monitor" ADD CONSTRAINT "maintenance_to_monitor_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check" ADD CONSTRAINT "check_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_run" ADD CONSTRAINT "monitor_run_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_run" ADD CONSTRAINT "monitor_run_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_location" ADD CONSTRAINT "private_location_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_location_to_monitor" ADD CONSTRAINT "private_location_to_monitor_private_location_id_private_location_id_fk" FOREIGN KEY ("private_location_id") REFERENCES "public"."private_location"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_location_to_monitor" ADD CONSTRAINT "private_location_to_monitor_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_group" ADD CONSTRAINT "monitor_group_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_group" ADD CONSTRAINT "monitor_group_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewer_accounts" ADD CONSTRAINT "viewer_accounts_user_id_viewer_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."viewer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewer_session" ADD CONSTRAINT "viewer_session_user_id_viewer_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."viewer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "notification_id_monitor_id_crontimestampe" ON "notification_trigger" USING btree ("notification_id","monitor_id","cron_timestamp");--> statement-breakpoint
CREATE INDEX "monitor_status_idx" ON "monitor_status" USING btree ("monitor_id","region");--> statement-breakpoint
CREATE INDEX "api_key_prefix_idx" ON "api_key" USING btree ("prefix");