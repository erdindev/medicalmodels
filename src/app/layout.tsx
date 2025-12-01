import type { Metadata } from "next";
import { Lato, Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { MagneticMesh } from "@/components/magnetic-mesh";

import { Analytics } from "@/components/analytics";


const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
  preload: true,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jost",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "MedicalModels - Medical AI Model Database",
    template: "%s | MedicalModels"
  },
  description: "Comprehensive database of 1,500+ peer-reviewed medical AI models. Compare performance metrics, validation data, and clinical applications across radiology, pathology, cardiology, and more.",
  keywords: ["medical AI", "healthcare AI", "machine learning medicine", "clinical AI models", "radiology AI", "pathology AI", "medical imaging AI", "deep learning healthcare", "AI diagnosis", "medical model comparison"],
  authors: [{ name: "MedicalModels" }],
  creator: "MedicalModels",
  publisher: "MedicalModels",
  metadataBase: new URL("https://medicalmodels.co"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medicalmodels.co",
    siteName: "MedicalModels",
    title: "MedicalModels - Medical AI Model Database",
    description: "Comprehensive database of 1,500+ peer-reviewed medical AI models. Compare performance metrics, validation data, and clinical applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MedicalModels - Medical AI Model Database",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MedicalModels - Medical AI Model Database",
    description: "Comprehensive database of 1,500+ peer-reviewed medical AI models.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add when you have these
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
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
      <body className={`${lato.className} ${jost.variable}`}>
        <Providers>
          <MagneticMesh />
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
