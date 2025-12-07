"use client";

import React, { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import ErrorBoundary from "@/components/ErrorBoundary";

interface ProviderWrapperProps {
  children: ReactNode;
}

export function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
