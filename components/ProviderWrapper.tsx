"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { AppContextProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

interface ProviderWrapperProps {
  children: ReactNode;
}

export function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

          {/* Error boundary ONLY wraps children */}
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </AppContextProvider>
    </ClerkProvider>
  );
}
