export const isAnInvalidTestUrl = (rawUrl: string) => {
  const url = new URL(rawUrl);
  const isSelfHostName = url.hostname
    .split(".")
    .slice(-2) // ex: any.sub.pingora.dev
    .join(".")
    .includes("pingora.dev"); // ex: pingora.dev:80

  return isSelfHostName && url.pathname.startsWith("/api/checker/");
};
