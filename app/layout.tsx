import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers/Providers";
import { Header } from "./components/ui/Header";
import { Footer } from "./components/ui/Footer";
/**
 * Metadata for the page
 */
export const metadata: Metadata = {
  title: "SmartFolio - DeFi Portfolio Management",
  description: "Optimize your crypto portfolio using Modern Portfolio Theory with AI-powered insights",
};

/**
 * Root layout for the page
 *
 * @param {object} props - The props for the root layout
 * @param {React.ReactNode} props.children - The children for the root layout
 * @returns {React.ReactNode} The root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <html lang="en">
        <body className="bg-gray-100 dark flex flex-col min-h-screen">
          <Providers>
            {/* Header (Fixed Height) */}
            {/* Main Content (Dynamic, Grows but Doesn't Force Scroll) */}
            <main className="flex-grow flex items-center justify-center px-4">{children}</main>
            {/* Footer (Fixed Height) */}
          </Providers>
        </body>
      </html>
  );
}
