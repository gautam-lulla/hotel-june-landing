import type { Metadata } from "next";
import { Outfit, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Free font alternatives matching the design aesthetic
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk", 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Hotel June - Boutique Hotels in Malibu and West LA",
  description: "Where It's Saturday Afternoon All Year Long. Hotel June is imbued with inviting design, vibrant food, and thoughtful details.",
  keywords: "boutique hotel, malibu, west la, luxury accommodation, california hotel, proper hospitality",
  openGraph: {
    title: "Hotel June - Boutique Hotels in Malibu and West LA",
    description: "Where It's Saturday Afternoon All Year Long",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel June - Boutique Hotels in Malibu and West LA"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel June - Boutique Hotels in Malibu and West LA", 
    description: "Where It's Saturday Afternoon All Year Long",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${hankenGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}