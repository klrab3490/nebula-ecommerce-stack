/**
 * @jest-environment node
 */

// Mock Prisma - must be defined inline in jest.mock()
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    bundle: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

// NOW import the route handlers and mocks
import { GET, POST } from "@/app/api/bundles/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Access the mocks with proper typing
const mockPrisma = prisma as any;
const mockCurrentUser = currentUser as any;

describe("Bundles API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/bundles", () => {
    it("should return all active bundles", async () => {
      const mockBundles = [
        {
          id: "bundle1",
          name: "Summer Bundle",
          description: "Great summer deal",
          discountType: "percentage",
          discountValue: 20,
          minQuantity: 2,
          maxQuantity: 10,
          isActive: true,
          validFrom: new Date("2024-01-01"),
          validUntil: new Date("2025-12-31"),
          createdAt: new Date(),
          updatedAt: new Date(),
          BundleProduct: [
            {
              id: "bp1",
              bundleId: "bundle1",
              productId: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId
              quantity: 2,
              isRequired: true,
              product: {
                id: "507f1f77bcf86cd799439011",
                name: "Product 1",
                price: 100,
                discountedPrice: null,
                images: [],
                stock: 10,
              },
            },
          ],
        },
      ];

      mockPrisma.bundle.findMany.mockResolvedValue(mockBundles);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.bundles).toHaveLength(1);
      expect(data.bundles[0].name).toBe("Summer Bundle");
      expect(mockPrisma.bundle.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [{ validUntil: null }, { validUntil: { gte: expect.any(Date) } }],
        },
        include: {
          BundleProduct: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  discountedPrice: true,
                  images: true,
                  stock: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors", async () => {
      mockPrisma.bundle.findMany.mockRejectedValue(new Error("Database error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch bundles");
    });
  });

  describe("POST /api/bundles", () => {
    const validBundleData = {
      name: "Winter Bundle",
      description: "Winter sale bundle",
      discountType: "percentage",
      discountValue: 15,
      minQuantity: 2,
      maxQuantity: 5,
      validUntil: "2025-12-31",
      products: [
        { productId: "507f1f77bcf86cd799439011", quantity: 2, isRequired: true },
        { productId: "507f1f77bcf86cd799439012", quantity: 1, isRequired: false },
      ],
    };

    it("should create bundle successfully as seller", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "user123",
        publicMetadata: { role: "seller" },
      });

      mockPrisma.bundle.create.mockResolvedValue({
        id: "newbundle",
        name: validBundleData.name,
        description: validBundleData.description,
        discountType: validBundleData.discountType,
        discountValue: validBundleData.discountValue,
        minQuantity: validBundleData.minQuantity,
        maxQuantity: validBundleData.maxQuantity,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(validBundleData.validUntil),
        createdAt: new Date(),
        updatedAt: new Date(),
        BundleProduct: [],
      });

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(validBundleData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.bundle.name).toBe("Winter Bundle");
    });

    it("should create bundle successfully as admin", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "admin123",
        publicMetadata: { role: "admin" },
      });

      mockPrisma.bundle.create.mockResolvedValue({
        id: "newbundle",
        name: validBundleData.name,
        description: validBundleData.description,
        discountType: validBundleData.discountType,
        discountValue: validBundleData.discountValue,
        minQuantity: validBundleData.minQuantity,
        maxQuantity: validBundleData.maxQuantity,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(validBundleData.validUntil),
        createdAt: new Date(),
        updatedAt: new Date(),
        BundleProduct: [],
      });

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(validBundleData),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it("should reject unauthenticated requests", async () => {
      mockCurrentUser.mockResolvedValue(null);

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(validBundleData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should reject non-seller/admin users", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "customer123",
        publicMetadata: { role: "customer" },
      });

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(validBundleData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Forbidden");
    });

    it("should validate required fields", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "seller123",
        publicMetadata: { role: "seller" },
      });

      const invalidData = {
        name: "Bundle",
        // missing description, discountType, discountValue, products
      };

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("should validate discount type", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "seller123",
        publicMetadata: { role: "seller" },
      });

      const invalidData = {
        ...validBundleData,
        discountType: "invalid_type",
      };

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid discount type");
    });

    it("should require at least one product", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "seller123",
        publicMetadata: { role: "seller" },
      });

      const invalidData = {
        ...validBundleData,
        products: [],
      };

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("should handle database errors during creation", async () => {
      mockCurrentUser.mockResolvedValue({
        id: "seller123",
        publicMetadata: { role: "seller" },
      });

      mockPrisma.bundle.create.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost/api/bundles", {
        method: "POST",
        body: JSON.stringify(validBundleData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create bundle");
    });
  });
});
