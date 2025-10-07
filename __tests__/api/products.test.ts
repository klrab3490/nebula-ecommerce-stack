/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// Mock Prisma before importing the route
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Import after mocking
import { POST, GET } from "@/app/api/products/route";
import { prisma } from "@/lib/prisma";

// Type cast the mocked prisma for easier access to mock methods
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Helper to create mock request
const createMockRequest = (body: unknown) => {
  return {
    json: async () => body,
  } as NextRequest;
};

describe("/api/products", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /api/products", () => {
    const validProductData = {
      name: "Test Product",
      description: "A test product description",
      price: 29.99,
      sku: "TEST-001",
      stock: 100,
      images: ["image1.jpg", "image2.jpg"],
      categories: ["electronics", "gadgets"],
    };

    it("creates a product successfully with valid data", async () => {
      const mockProduct = {
        id: "product-id-123",
        ...validProductData,
      };

      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockResolvedValue(mockProduct);

      const request = createMockRequest(validProductData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.product.id).toBe("product-id-123");
      expect(data.product.name).toBe("Test Product");
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: "Test Product",
          description: "A test product description",
          price: 29.99,
          sku: "TEST-001",
          stock: 100,
          images: ["image1.jpg", "image2.jpg"],
          categories: ["electronics", "gadgets"],
        },
      });
    });

    it("returns 400 for missing required fields", async () => {
      const invalidData = {
        name: "Test Product",
        // missing description, price, sku, stock
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid price", async () => {
      const invalidData = {
        ...validProductData,
        price: -10, // negative price
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Price must be a positive number");
      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid stock", async () => {
      const invalidData = {
        ...validProductData,
        stock: -5, // negative stock
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Stock must be a non-negative number");
      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });

    it("returns 409 for duplicate SKU", async () => {
      const existingProduct = { id: "existing-id", sku: "TEST-001" };
      mockPrisma.product.findUnique.mockResolvedValue(existingProduct);

      const request = createMockRequest(validProductData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("A product with this SKU already exists");
      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });

    it("handles database errors gracefully", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockRejectedValue(
        new Error("Database connection failed")
      );

      const request = createMockRequest(validProductData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create product. Please try again.");
    });

    it("handles Prisma unique constraint errors", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockRejectedValue(
        new Error("Unique constraint failed on the fields: (`sku`)")
      );

      const request = createMockRequest(validProductData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("A product with this SKU already exists");
    });

    it("trims whitespace from string fields", async () => {
      const dataWithWhitespace = {
        ...validProductData,
        name: "  Test Product  ",
        description: "  A test description  ",
        sku: "  TEST-001  ",
      };

      const mockProduct = {
        id: "product-id-123",
        name: "Test Product",
        sku: "TEST-001",
      };

      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockResolvedValue(mockProduct);

      const request = createMockRequest(dataWithWhitespace);
      await POST(request);

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: "Test Product",
          description: "A test description",
          price: 29.99,
          sku: "TEST-001",
          stock: 100,
          images: ["image1.jpg", "image2.jpg"],
          categories: ["electronics", "gadgets"],
        },
      });
    });

    it("handles optional fields correctly", async () => {
      const minimalData = {
        name: "Minimal Product",
        description: "Minimal description",
        price: 10.0,
        sku: "MIN-001",
        stock: 1,
        // images and categories are optional
      };

      const mockProduct = {
        id: "minimal-product-id",
        name: "Minimal Product",
        sku: "MIN-001",
      };

      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockResolvedValue(mockProduct);

      const request = createMockRequest(minimalData);
      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: "Minimal Product",
          description: "Minimal description",
          price: 10.0,
          sku: "MIN-001",
          stock: 1,
          images: [],
          categories: [],
        },
      });
    });
  });

  describe("GET /api/products", () => {
    it("returns all products successfully", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Product 1",
          description: "Description 1",
          price: 29.99,
          sku: "PROD-001",
          stock: 10,
          images: [],
          categories: [],
        },
        {
          id: "2",
          name: "Product 2",
          description: "Description 2",
          price: 39.99,
          sku: "PROD-002",
          stock: 5,
          images: [],
          categories: [],
        },
      ];

      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toEqual(mockProducts);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        orderBy: {
          id: "desc",
        },
      });
    });

    it("returns empty array when no products exist", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toEqual([]);
    });

    it("handles database errors gracefully", async () => {
      mockPrisma.product.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch products");
    });
  });
});
