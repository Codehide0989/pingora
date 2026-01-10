# Status Widget

Create an account on [pingora.dev](https://pingora.dev), start monitoring
your endpoints and include your own StatusWidget into your React Application.

![Image of StatusWidget on pingora.dev](https://pingora.dev/assets/changelog/status-widget.png)

## Install

```bash
npm install @pingora/react
pnpm add @pingora/react
yarn add @pingora/react
bun add @pingora/react
```

## How to use the StatusWidget in your Next.js App Router

### Include the styles.css

If you are using tailwind, extend your config with:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{tsx,ts,mdx,md}",
    // Pingora Widget
    "./node_modules/@pingora/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Otherwise, include the styles in your App:

```tsx
// app/layout.tsx
import "@pingora/react/dist/styles.css";
```

The `StatusWidget` is a React Server Component. Include the `slug` to your
status-page.

```tsx
import { StatusWidget } from "@pingora/react";

export function Page() {
  return <StatusWidget slug="status" />;
}
```

## Headless getStatus utility function

If you would like to style it yourself, you can use the `getStatus` function to
access the type response of the api call to:

`https://api.pingora.dev/public/status/:slug`

Learn more about our supported
[API endpoints](https://docs.pingora.dev/api-reference/auth).

```ts
import { getStatus } from "@pingora/react";

// React Server Component
async function CustomStatusWidget() {
  const res = await getStatus("slug");
  // ^StatusResponse = { status: Status }

  const { status } = res;
  // ^Status = "unknown" | "operational" | "degraded_performance" | "partial_outage" | "major_outage" | "under_maintenance"

  return <div>{/* customize */}</div>;
}
```

```ts
export type Status =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage"
  | "under_maintenance"
  | "unknown"
  | "incident";
```

Learn more in the [docs](https://docs.pingora.dev/packages/react).

### About Pingora

Pingora is an open source monitoring services with incident managements.

Follow our journey [@pingoraHQ](https://x.com/pingoraHQ).
