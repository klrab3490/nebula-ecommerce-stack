"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// GET /api/bundles/[id] - Fetch specific bundle
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bundle = await prisma.bundle.findUnique({
      where: { id },
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
                description: true,
              },
            },
          },
        },
      },
    });

    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Error fetching bundle:", error);
    return NextResponse.json({ error: "Failed to fetch bundle" }, { status: 500 });
  }
}

// PUT /api/bundles/[id] - Update bundle (seller/admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string;
    if (role !== "seller" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, bundleType, offerPrice, isActive, validUntil, items } = body;

    // Update bundle
    const updateData: {
      name?: string;
      description?: string;
      bundleType?: string;
      offerPrice?: number;
      normalPrice?: number;
      savings?: number;
      isActive?: boolean;
      validUntil?: Date | null;
    } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (bundleType !== undefined) updateData.bundleType = bundleType;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null;

    // If offerPrice is provided, recalculate savings
    if (offerPrice !== undefined) {
      const currentBundle = await prisma.bundle.findUnique({
        where: { id },
        select: { normalPrice: true },
      });
      if (currentBundle) {
        updateData.offerPrice = offerPrice;
        updateData.savings = currentBundle.normalPrice - offerPrice;
      }
    }

    const bundle = await prisma.bundle.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If items array is provided, update bundle items
    if (items) {
      // Remove existing bundle items
      await prisma.bundleItem.deleteMany({
        where: { bundleId: id },
      });

      // Add new bundle items
      await prisma.bundleItem.createMany({
        data: items.map((item: { productId: string; quantity?: number; isRequired?: boolean }) => ({
          bundleId: id,
          productId: item.productId,
          quantity: item.quantity || 1,
          isRequired: item.isRequired !== false,
        })),
      });
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Error updating bundle:", error);
    return NextResponse.json({ error: "Failed to update bundle" }, { status: 500 });
  }
}

// DELETE /api/bundles/[id] - Delete bundle (seller/admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string;
    if (role !== "seller" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await prisma.bundle.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Bundle deleted successfully" });
  } catch (error) {
    console.error("Error deleting bundle:", error);
    return NextResponse.json({ error: "Failed to delete bundle" }, { status: 500 });
  }
}
