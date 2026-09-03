import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { FrontendWrapper } from "@/components/layout/FrontendWrapper";
import { TypeKitLoader } from "@/components/layout/TypeKitLoader";
import BusinessSchema from "@/components/seo/BusinessSchema";

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
        <BusinessSchema />
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5W48PMB4');`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1027424473332298');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1027424473332298&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
