import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

import { Analytics } from "@/components/analytics";


const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "MedicalModels - AI Models for Healthcare",
  description: "Discover, compare, and evaluate medical AI models for clinical and research applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          src="https://plausible.io/js/pa-cJgHuElIJn9FrBlQqQhVK.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
      </head>
      <body className={lato.className}>
        <Providers>

          <Navbar />
          <main className="min-h-screen">{children}</main>
          <CookieConsent />
          <Analytics />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
