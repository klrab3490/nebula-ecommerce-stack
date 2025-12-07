"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// GET /api/bundles - Fetch all active bundles
export async function GET() {
  try {
    const bundles = await prisma.bundle.findMany({
      where: {
        isActive: true,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bundles });
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}

// POST /api/bundles - Create a new bundle (seller/admin only)
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string;
    if (role !== "seller" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      bundleType,
      validUntil,
      items, // Array of { productId, quantity, isRequired }
    } = body;

    // Validate required fields
    if (!name || !bundleType || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, bundleType, items" },
        { status: 400 }
      );
    }

    // Validate bundleType
    if (!["combo", "fixed_discount", "bogo"].includes(bundleType)) {
      return NextResponse.json({ error: "Invalid bundle type" }, { status: 400 });
    }

    // Fetch product details to calculate prices
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, discountedPrice: true },
    });

    // Calculate normal price (sum of individual prices)
    let normalPrice = 0;
    items.forEach((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const itemPrice = product.discountedPrice || product.price;
        normalPrice += itemPrice * (item.quantity || 1);
      }
    });

    // Calculate offer price based on bundle type
    let offerPrice = normalPrice;
    switch (bundleType) {
      case "combo":
        offerPrice = normalPrice * 0.8; // 20% off
        break;
      case "fixed_discount":
        offerPrice = normalPrice * 0.9; // 10% off
        break;
      case "bogo":
        offerPrice = normalPrice * 0.5; // 50% off
        break;
    }

    const savings = normalPrice - offerPrice;

    // Create bundle with items
    const bundle = await prisma.bundle.create({
      data: {
        name,
        description,
        bundleType,
        normalPrice,
        offerPrice,
        savings,
        validUntil: validUntil ? new Date(validUntil) : null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity || 1,
            isRequired: item.isRequired !== false,
          })),
        },
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
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ bundle }, { status: 201 });
  } catch (error) {
    console.error("Error creating bundle:", error);
    return NextResponse.json({ error: "Failed to create bundle" }, { status: 500 });
  }
}
