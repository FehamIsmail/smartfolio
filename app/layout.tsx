import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers/Providers";
import BackgroundEffect from "./components/ui/BackgroundEffect";
/**
 * Metadata for the page
 */
export const metadata: Metadata = {
  title: "SmartFolio - DeFi Portfolio Management",
  description: "Optimize your crypto portfolio using Modern Portfolio Theory with AI-powered insights",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ]
  }
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
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <Providers>
          {/* Background Effects */}
          <BackgroundEffect />
          
          {/* Main Content */}
          <main className="flex-grow flex items-center justify-center px-4 py-8 relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
