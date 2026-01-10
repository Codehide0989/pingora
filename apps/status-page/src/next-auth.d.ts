import type { Viewer as DefaultViewerSchema } from "@pingora/db/src/schema";

declare module "next-auth" {
  interface User extends DefaultViewerSchema {}
}
