// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://portal.romuz.com.ly";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/appointments`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/orders`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/prescriptions`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/profile`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/auth/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/auth/register`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
