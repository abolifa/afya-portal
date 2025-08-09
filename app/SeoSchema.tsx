// app/SeoSchema.tsx
"use client";
import Script from "next/script";

export default function SeoSchema() {
  const org = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "الهيئة الوطنية لأمراض الكلى",
    alternateName: "National Kidney Authority - Libya",
    url: "https://romuz.com.ly",
    sameAs: ["https://portal.romuz.com.ly"],
    areaServed: "LY",
    logo: "https://portal.romuz.com.ly/logo.png",
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "نظام عافية الصحي - بوابة المريض",
    applicationCategory: "MedicalApplication",
    operatingSystem: "Web",
    url: "https://portal.romuz.com.ly",
    offers: { "@type": "Offer", price: "0", priceCurrency: "LYD" },
  };

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <Script
        id="schema-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
    </>
  );
}
