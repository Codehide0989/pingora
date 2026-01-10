import "server-only";

import { type AppRouter, appRouter, t } from "@pingora/api";
import type { Context } from "@pingora/api/src/trpc";
import { db } from "@pingora/db";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { makeQueryClient } from "./query-client";

const createContextCached = cache(
  async (..._args: unknown[]): Promise<Context> => {
    return {
      req: undefined,
      db,
      session: null,
    };
  },
);

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
const caller = t.createCallerFactory(appRouter)(createContextCached);
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
