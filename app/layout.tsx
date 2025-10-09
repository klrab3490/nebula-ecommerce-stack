import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { AppContextProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/components/theme/theme-provider";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative min-h-screen">
                {/* Modern Background with Gradient Mesh */}
                <div className="fixed inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20 -z-10"></div>
                <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse -z-10"></div>
                <div
                  className="fixed bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse -z-10"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="fixed top-1/3 right-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse -z-10"
                  style={{ animationDelay: "4s" }}
                ></div>

                <Navbar />
                <main className="relative z-10">
                  <NextSSRPlugin
                    /**
                     * The `extractRouterConfig` will extract **only** the route configs
                     * from the router to prevent additional information from being
                     * leaked to the client. The data passed to the client is the same
                     * as if you were to fetch `/api/uploadthing` directly.
                     */
                    routerConfig={extractRouterConfig(ourFileRouter)}
                  />
                  {children}
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
