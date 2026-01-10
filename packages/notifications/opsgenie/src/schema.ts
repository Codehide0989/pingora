import { opsgenieDataSchema } from "@pingora/db/src/schema";
import { z } from "zod";

export const OpsGenieSchema = opsgenieDataSchema;

export const OpsGeniePayloadAlert = z.object({
  message: z.string(),
  alias: z.string(),
  description: z.string(),
  source: z.string().prefault("Pingora"),
  details: z
    .object({
      message: z.string(),
      status: z.number().optional(),
      severity: z.enum(["degraded", "down"]),
    })
    .optional(),
});

export const OpsGenieCloseAlert = z.object({
  source: z.string().prefault("Pingora"),
});
