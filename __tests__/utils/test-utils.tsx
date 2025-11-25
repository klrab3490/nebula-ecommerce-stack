import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

// Mock product data
export const mockProduct = {
  id: "prod_123",
  name: "Test Product",
  description: "Test product description",
  price: 99.99,
  discountedPrice: 79.99,
  sku: "TEST-SKU-001",
  stock: 10,
  images: ["/test-image.jpg"],
  categories: ["electronics", "gadgets"],
  featured: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Mock bundle data
export const mockBundle = {
  id: "bundle_123",
  name: "Test Bundle",
  description: "Test bundle description",
  discountType: "percentage",
  discountValue: 20,
  minQuantity: 2,
  maxQuantity: 10,
  isActive: true,
  validFrom: new Date("2024-01-01"),
  validUntil: new Date("2025-12-31"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Mock user data
export const mockUser = {
  id: "user_123",
  email: "test@example.com",
  name: "Test User",
  role: "customer",
  clerkId: "clerk_123",
};

// Mock address data
export const mockAddress = {
  id: "addr_123",
  name: "Home",
  userId: "user_123",
  street: "123 Test St",
  city: "Test City",
  state: "Test State",
  zipCode: "12345",
  country: "Test Country",
  phone: "1234567890",
  isDefault: true,
};

// Mock order data
export const mockOrder = {
  id: "order_123",
  userId: "user_123",
  total: 199.98,
  status: "pending",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

// Placeholder test to prevent Jest warning
describe("Test Utils", () => {
  it("exports test utilities", () => {
    expect(customRender).toBeDefined();
  });
});
