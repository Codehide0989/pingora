import { apiKeyRouter } from "./router/apiKey";
import { emailRouter } from "./router/email";
import { createTRPCRouter } from "./trpc";
// Deployed to /trpc/lambda/**
export const lambdaRouter = createTRPCRouter({
  emailRouter: emailRouter,
  apiKeyRouter: apiKeyRouter,
});

