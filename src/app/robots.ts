import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/projects", "/finance", "/workers", "/api/"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
