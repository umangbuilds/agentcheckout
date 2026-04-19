/* Root layout — metadata, fonts, analytics */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://agentcheckout.app"
  ),
  title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes",
  description:
    "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store.",
  openGraph: {
    title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes",
    description:
      "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes",
    description:
      "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="canonical" href="https://agentcheckout.app/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"Organization","name":"AgentCheckout","url":"https://agentcheckout.app","logo":"https://agentcheckout.app/icon","description":"AgentCheckout makes any D2C store shoppable by AI agents in 10 minutes via a hosted MCP endpoint."}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"SoftwareApplication","name":"AgentCheckout","applicationCategory":"BusinessApplication","operatingSystem":"Web","url":"https://agentcheckout.app","offers":{"@type":"Offer","price":"0","priceCurrency":"USD","description":"Free during beta"}}` }} />
      </head>
      <body className="min-h-full">
        <Script
          id="posthog"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_nLir4pN5C6RgPMrmvM8kAapzH5rgCZjMNkuZqUHRkEkq',{api_host:'https://us.i.posthog.com',capture_pageview:true})`,
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
