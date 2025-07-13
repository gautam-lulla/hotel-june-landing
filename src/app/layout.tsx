import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

// Free premium fonts that match the design aesthetic
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap', // Improves performance
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans", 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Hotel June - Boutique Hotels in Malibu and West LA",
  description: "Where It's Saturday Afternoon All Year Long. Hotel June is imbued with inviting design, vibrant food, and thoughtful details.",
  keywords: "boutique hotel, malibu, west la, luxury accommodation, california hotel",
  openGraph: {
    title: "Hotel June - Boutique Hotels in Malibu and West LA",
    description: "Where It's Saturday Afternoon All Year Long",
    images: ["/og-image.jpg"], // Add your hero image here
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}