"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, discountedPrice, sku, stock, images, categories, featured, faqs } =
      await req.json();

    // Validate required fields
    if (
      !name ||
      !description ||
      !sku ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a non-negative number" },
        { status: 400 }
      );
    }

    // Validate discounted price for featured products
    if (featured && discountedPrice !== null) {
      if (typeof discountedPrice !== "number" || discountedPrice <= 0) {
        return NextResponse.json(
          { error: "Discounted price must be a positive number for featured products" },
          { status: 400 }
        );
      }
      
      if (discountedPrice >= price) {
        return NextResponse.json(
          { error: "Discounted price must be less than the original price" },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }

    // Get current Date & Time
    const now = new Date();

    // Prepare nested create for FAQs if provided
    // Each FAQ will be created and linked via the ProductFAQ join model
    type IncomingFAQ = { question?: unknown; answer?: unknown };
    const faqCreates = Array.isArray(faqs)
      ? (faqs as IncomingFAQ[])
          .filter((f) => f && typeof f.question === "string" && typeof f.answer === "string")
          .map((f) => ({ faq: { create: { question: (f.question as string).trim(), answer: (f.answer as string).trim() } } }))
      : [];

    // Create the product (with nested FAQ relations when present)
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price,
        discountedPrice: discountedPrice ?? null,
        sku: sku.trim(),
        stock,
        images: images || [],
        categories: categories || [],
        featured: featured || false,
        createdAt: now,
        updatedAt: now,
        ProductFAQ: faqCreates.length > 0 ? { create: faqCreates } : undefined,
      },
      include: {
        ProductFAQ: {
          include: { faq: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error creating product:", error);

    // Handle Prisma unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products: products }, { status: 200 });
  } catch (error) {
    console.error("API error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
