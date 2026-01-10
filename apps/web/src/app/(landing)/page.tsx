import { CustomMDX } from "@/content/mdx";
import { getHomePage } from "@/content/utils";
import type { Metadata } from "next";
import type { Organization, Product, WebPage, WithContext } from "schema-dts";
import { defaultMetadata } from "../shared-metadata";
import { getJsonLDOrganization, getJsonLDProduct } from "../shared-metadata";

const jsonLdProduct: WithContext<Product> = getJsonLDProduct();

const jsonLdOrganization: WithContext<Organization> = getJsonLDOrganization();

const jsonLDWebpage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "pingora",
  description: "Open-source uptime and synthetic monitoring with status pages.",
  url: "https://pingora.dev",
  image: "https://pingora.dev/assets/logos/Pingora-Logo.svg",
  headline: "Showcase your uptime with a status page",
};

export const metadata: Metadata = defaultMetadata;

import { PaymentPage } from "@/components/payment-page";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  if (searchParams?.pa) {
    return <PaymentPage searchParams={searchParams} />;
  }
  
  const homePage = getHomePage();
  return (
    <div className="prose dark:prose-invert max-w-none">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: jsonLd
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdProduct).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: jsonLd
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdOrganization).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: jsonLd
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLDWebpage).replace(/</g, "\\u003c"),
        }}
      />
      <h1>{homePage.metadata.title}</h1>
      <p className="text-lg">{homePage.metadata.description}</p>
      <CustomMDX source={homePage.content} />
    </div>
  );
}
