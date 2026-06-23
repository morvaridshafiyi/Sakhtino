import type { Metadata } from "next";
import "@fontsource/estedad/arabic-300.css";
import "@fontsource/estedad/arabic-400.css";
import "@fontsource/estedad/arabic-500.css";
import "@fontsource/estedad/arabic-600.css";
import "@fontsource/estedad/arabic-700.css";
import { Providers } from "@/components/providers";
import { createMetadata, createOrganizationJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = createOrganizationJsonLd();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
