import { redirect } from "next/navigation";

export default function DiscordRedirect() {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.pingora.dev";
  return redirect(docsUrl);
}
