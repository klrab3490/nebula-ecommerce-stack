"use client";

import React, { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import ErrorBoundary from "@/components/ErrorBoundary";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface ProviderWrapperProps {
  children: ReactNode;
}

export function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <ClerkProvider>
      <ErrorBoundary>
        <AppContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
          </ThemeProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </ClerkProvider>
  );
}
