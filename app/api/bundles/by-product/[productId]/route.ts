import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/bundles/by-product/[productId] - Fetch bundles containing a specific product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Find all bundles that contain this product
    const bundles = await prisma.bundle.findMany({
      where: {
        isActive: true,
        items: {
          some: {
            productId: productId,
          },
        },
        OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
      },
      include: {
        items: {
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
      orderBy: { savings: "desc" },
    });

    return NextResponse.json({ bundles });
  } catch (error) {
    console.error("Error fetching bundles for product:", error);
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}
