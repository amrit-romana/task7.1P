import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { FrontendWrapper } from "@/components/layout/FrontendWrapper";
import { TypeKitLoader } from "@/components/layout/TypeKitLoader";

export const metadata: Metadata = {
  metadataBase: new URL("https://renaissancedecor.com.au"),
  title: {
    default: "Renaissance Decor | Venetian Plaster & Decorative Finishes Melbourne",
    template: "%s | Renaissance Decor",
  },
  description: "Premium Venetian Plaster, Micro Cement, and decorative surface finishes across Melbourne, Mornington Peninsula, and greater Victoria. Bespoke craftsmanship for interior designers, builders, and architects.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Renaissance Decor",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
      </head>
      <body suppressHydrationWarning className={`font-futura antialiased selection:bg-stone selection:text-charcoal`}>
        <TypeKitLoader />
        <FrontendWrapper>
          {children}
        </FrontendWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
