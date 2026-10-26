"use client";
import { Suspense } from "react";
const SCREEN_SHOT = "https://bridget-brown.vercel.app/screenshot.png";
const DEFAULT_TITLE = "Bridget & Brown - Wedding Invitation";
const DEFAULT_DESCRIPTION =
  "Welcome to the party B&B | Register: For Access";


function SiteMetaInner() {
  return (
    <>
      <title>{DEFAULT_TITLE}</title>
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta name="author" content="Marshalsoft" />
      <meta name="robots" content="index, follow" />
      <link rel="preconnect" href="https://bridget-brown.vercel.app/" />
      <link rel="canonical" href="https://bridget-brown.vercel.app/" />
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
      <meta name="keywords" content={String(DEFAULT_TITLE).split(" ").filter((label,index) => label !== "&").join(",")} />
      <meta property="og:title" content={DEFAULT_TITLE} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:image" content={SCREEN_SHOT} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bridget-brown.vercel.app" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="BB" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" /> 
      <meta name="twitter:title" content={DEFAULT_TITLE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
       <meta name="twitter:image" content={SCREEN_SHOT} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://bridget-brown.vercel.app" />
      <meta name="twitter:site" content="@BB" />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="630" />
    </>
  );
}

export default function SiteMeta() {
  return (
    <Suspense
      fallback={
        <>
          <title>{DEFAULT_TITLE}</title>
          <meta name="description" content={DEFAULT_DESCRIPTION} />
          <meta name="author" content="Marshalsoft" />
        </>
      }
    >
      <SiteMetaInner />
    </Suspense>
  );
}
