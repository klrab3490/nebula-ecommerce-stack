import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import ClientFloatingButton from "@/components/ClientFloatingButton";
// import { Geist, Geist_Mono } from "next/font/google";
import { ProviderWrapper } from "@/components/ProviderWrapper";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Nebula E-Commerce - Premium Beauty & Wellness",
  description:
    "Discover premium quality beauty and wellness products with Nebula E-Commerce. Natural hair oils, organic face packs, and traditional wellness solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ProviderWrapper>
          <div className="relative min-h-screen">
            {/* Modern Background with Gradient Mesh */}
            <div className="fixed inset-0 bg-linear-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-blue-950/30 -z-10"></div>
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse -z-10 duration-[4s]"></div>
            <div
              className="fixed bottom-0 right-1/4 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse -z-10 duration-[5s]"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="fixed top-1/3 right-1/3 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse -z-10 duration-[6s]"
              style={{ animationDelay: "4s" }}
            ></div>

            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
            <ClientFloatingButton />
          </div>
        </ProviderWrapper>
      </body>
      {/* Razorpay checkout script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </html>
  );
}
