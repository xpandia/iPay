import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "iPay | Pagos Inteligentes en Solana",
  description: "iPay — Plataforma de pagos inteligentes en Solana. Acepta SOL, USDC, EURC y PYUSD con loyalty automático e IA. Powered by xpandia.",
  openGraph: {
    title: "iPay | Pagos Inteligentes en Solana",
    description: "Pagos cripto con 0.5% de comisión, liquidación instantánea y loyalty automático. Built on Solana.",
    url: "https://ipay.xpandia.co",
    siteName: "iPay",
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "iPay | The Future of Payments",
    description: "Pagos cripto con 0.5% de comisión, liquidación instantánea y loyalty automático.",
  },
  metadataBase: new URL("https://ipay.xpandia.co"),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} font-sans bg-gray-950 text-white antialiased`}
      >
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "iPay",
              "alternateName": "iPay PayFi",
              "description":
                "The Square of PayFi — Intelligent payments platform on Solana combining crypto payments, automatic loyalty tokens, and AI merchant tools for Latin America.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "url": "https://ipay.xpandia.co",
              "author": {
                "@type": "Organization",
                "name": "xpandia",
                "url": "https://xpandia.co",
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier up to $1,000/month in transactions",
              },
              "featureList": [
                "Instant payments on Solana (sub-second settlement)",
                "0.5% transaction fee (vs 3-7% traditional)",
                "Automatic loyalty token minting via Transfer Hooks",
                "AI merchant assistant for natural language payments",
                "Solana Blinks shareable payment links",
                "Multi-currency support (SOL, USDC, EURC, PYUSD)",
                "Escrow payments with dispute resolution",
                "Recurring subscription payments",
                "Developer API with webhooks",
                "21 on-chain smart contract instructions",
              ],
              "keywords":
                "PayFi, Solana, payments, loyalty, AI, LATAM, Blinks, stablecoin, USDC, merchant",
            }),
          }}
        />
      </body>
    </html>
  );
}
