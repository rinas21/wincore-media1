import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import GrainOverlay from "@/components/GrainOverlay";
import ContactFooter from "@/components/ContactFooter";

export const metadata: Metadata = {
  title: "Wincore — Award-Winning Creative Digital Agency | Colombo & Global",
  description:
    "Wincore is Sri Lanka’s most awarded creative and AI-powered digital agency. We turn brands into cinematic, immersive experiences.",
  metadataBase: new URL("https://agency.wincore.lk"),
  openGraph: {
    title: "Wincore — Creative & AI-Powered Digital Studio",
    description:
      "Award-winning creative digital agency based in Colombo, delivering cinematic brand experiences, WebGL, and AI-powered campaigns for global clients.",
    url: "https://agency.wincore.lk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wincore — Creative & AI-Powered Digital Studio",
    description:
      "Award-winning creative digital agency based in Colombo, delivering cinematic brand experiences, WebGL, and AI-powered campaigns for global clients.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ClientProvider>
          <Preloader />
          <GrainOverlay />
          <CustomCursor />
          <Header />
          {children}
          {/* Fixed block: margin on <footer> can collapse with last section — spacer guarantees a gap */}
          <div
            className="cf-footer-gap min-h-[clamp(2.5rem,6vw,5rem)] shrink-0 bg-background"
            aria-hidden
          />
          <ContactFooter />
        </ClientProvider>
      </body>
    </html>
  );
}

