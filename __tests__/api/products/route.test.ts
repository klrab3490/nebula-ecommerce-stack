/**
 * @jest-environment node
 */

// Mock Prisma - must be defined inline in jest.mock()
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock the auth function
jest.mock("@/lib/authSeller", () => ({
  requireAuth: jest.fn(),
}));

// NOW import everything
import { GET, POST } from "@/app/api/products/route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authSeller";

// Access the mocks
const mockPrisma = prisma as any;
const mockRequireAuth = requireAuth as any;

describe("Products API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return all products", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Product 1",
          description: "Description 1",
          price: 100,
          discountedPrice: null,
          sku: "SKU1",
          stock: 10,
          images: [],
          categories: [],
          featured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Product 2",
          description: "Description 2",
          price: 200,
          discountedPrice: 180,
          sku: "SKU2",
          stock: 5,
          images: ["/image.jpg"],
          categories: ["electronics"],
          featured: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toHaveLength(2);
      expect(data.products[0].name).toBe("Product 1");
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors", async () => {
      mockPrisma.product.findMany.mockRejectedValue(new Error("Database error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch products");
    });
  });

  describe("POST /api/products", () => {
    const validProductData = {
      name: "New Product",
      description: "Product description",
      price: 150,
      discountedPrice: null,
      sku: "NEWSKU",
      stock: 20,
      images: ["/image1.jpg"],
      categories: ["electronics", "gadgets"],
      featured: false,
      faqs: [],
    };

    it("should create a product successfully", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);
      mockPrisma.product.findUnique.mockResolvedValue(null); // SKU not exists
      mockPrisma.product.create.mockResolvedValue({
        id: "new-id",
        ...validProductData,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductFAQ: [],
      });

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(validProductData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.product.name).toBe("New Product");
    });

    it("should reject request without authentication", async () => {
      const mockResponse = new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
      // Mock unauthorized response using NextResponse
      mockRequireAuth.mockResolvedValueOnce(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(validProductData),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should validate required fields", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);

      const invalidData = {
        description: "Missing name",
        price: 100,
      };

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("should validate price is positive", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);

      const invalidData = {
        ...validProductData,
        price: -10,
      };

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Price must be a positive number");
    });

    it("should validate stock is non-negative", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);

      const invalidData = {
        ...validProductData,
        stock: -5,
      };

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Stock must be a non-negative number");
    });

    it("should validate discounted price is less than original price", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);

      const invalidData = {
        ...validProductData,
        featured: true,
        discountedPrice: 200, // Higher than price
      };

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Discounted price must be less than the original price");
    });

    it("should prevent duplicate SKU", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);
      mockPrisma.product.findUnique.mockResolvedValue({
        id: "existing-id",
        sku: validProductData.sku,
      } as any);

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(validProductData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("A product with this SKU already exists");
    });

    it("should create product with FAQs", async () => {
      mockRequireAuth.mockResolvedValueOnce(undefined);

      const productWithFaqs = {
        ...validProductData,
        faqs: [
          { question: "What is this?", answer: "A product" },
          { question: "How to use?", answer: "Just use it" },
        ],
      };

      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.product.create.mockResolvedValue({
        id: "new-id",
        name: productWithFaqs.name,
        description: productWithFaqs.description,
        price: productWithFaqs.price,
        discountedPrice: null,
        sku: productWithFaqs.sku,
        stock: productWithFaqs.stock,
        images: productWithFaqs.images,
        categories: productWithFaqs.categories,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductFAQ: [
          {
            id: "faq1",
            productId: "new-id",
            faqId: "faq-id-1",
            faq: { id: "faq-id-1", question: "What is this?", answer: "A product" },
          },
        ],
      } as any);

      const request = new NextRequest("http://localhost/api/products", {
        method: "POST",
        body: JSON.stringify(productWithFaqs),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });
  });
});
