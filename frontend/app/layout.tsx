import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/Toast";

// Heading font — bold, premium (Clash Display alternative)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Body font — clean, modern (Satoshi alternative)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Algotrix — AI-Powered AutoML Platform",
    template: "%s · Algotrix",
  },
  description:
    "Upload your data, and let Algotrix automatically clean, analyze, train, and tune machine learning models — no code required.",
  keywords: [
    "AutoML",
    "machine learning",
    "no-code ML",
    "model training",
    "data science",
    "Algotrix",
  ],
  authors: [{ name: "Algotrix" }],
  openGraph: {
    title: "Algotrix — AI-Powered AutoML Platform",
    description:
      "From raw data to a trained model in minutes. Upload a CSV and let Algotrix clean, analyze, train, and tune ML models automatically.",
    type: "website",
    siteName: "Algotrix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algotrix — AI-Powered AutoML Platform",
    description:
      "From raw data to a trained model in minutes — no code required.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
