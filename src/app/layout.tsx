import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next"
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
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5W48PMB4');`}
        </Script>
      </head>
      <body suppressHydrationWarning className={`font-futura antialiased selection:bg-stone selection:text-charcoal`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5W48PMB4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <TypeKitLoader />
        <FrontendWrapper>
          {children}
        </FrontendWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
