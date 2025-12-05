import type { Metadata } from "next";
import { Quicksand, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Total Human Design - The Complete Map to Your True Self",
  description:
    "Discover your Human Design chart and begin your 44-week deconditioning journey. A Filipino-centered approach to understanding your true nature.",
  keywords: [
    "Human Design",
    "Filipino",
    "Deconditioning",
    "Self Discovery",
    "Chart Generator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
