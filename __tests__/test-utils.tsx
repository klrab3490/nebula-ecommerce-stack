/**
 * Test Utilities
 * Common utilities and helpers for testing
 */

import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AppContextProvider } from "@/contexts/AppContext";

// Mock Next.js Image component
import Image from "next/image";
export const MockImage = ({ src, alt, ...props }: { src: string; alt: string;[key: string]: unknown }) => (
  <Image src={src} alt={alt} width={500} height={500} {...props} />
);

// Mock Next.js Link component
export const MockLink = ({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}) => (
  <a href={href} {...props}>
    {children}
  </a>
);

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AppContextProvider>{children}</AppContextProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Common mock data
export const mockProduct = {
  id: "test-product-1",
  name: "Test Product",
  description: "A test product for testing purposes",
  price: 29.99,
  sku: "TEST-001",
  stock: 100,
  image: "/test-product.jpg",
  alt: "Test product image",
  images: ["/test-product.jpg", "/test-product-2.jpg"],
  categories: ["electronics", "test"],
};

export const mockCartItem = {
  id: "test-product-1",
  name: "Test Product",
  price: 29.99,
  quantity: 1,
  image: "/test-product.jpg",
};

export const mockUser = {
  id: "test-user-123",
  name: "Test User",
  email: "test@example.com",
  role: "buyer",
};

// Mock localStorage for testing
export const createMockLocalStorage = () => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

// Setup function for tests that need to suppress console errors
export const suppressConsoleErrors = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

// Helper to wait for async operations in tests
export const waitForAsync = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));