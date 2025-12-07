"use server";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/authSeller";
import { utapi } from "@/lib/uploadthing-server";

type RouteContext = { params: Promise<{ id: string }> };

async function getParams(context: RouteContext) {
  return await context.params;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const params = await getParams(context as RouteContext);
    const id = params?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { ProductFAQ: { include: { faq: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Map ProductFAQ relations into a simple faq array
    const out = {
      ...product,
      faq: product.ProductFAQ?.map((pf) => pf.faq) ?? [],
    };

    return NextResponse.json({ product: out }, { status: 200 });
  } catch (error) {
    console.error("API error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const authCheck = await requireAuth(req, ["seller", "admin"]);
  if (authCheck instanceof NextResponse) return authCheck;
  try {
    const params = await getParams(context as RouteContext);
    const id = params?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }
    const body = await req.json();

    // Basic validation
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.discountedPrice !== undefined)
      updateData.discountedPrice =
        body.discountedPrice === null ? null : Number(body.discountedPrice);
    if (body.sku !== undefined) updateData.sku = String(body.sku).trim();
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.images !== undefined)
      updateData.images = Array.isArray(body.images) ? body.images : [];
    if (body.categories !== undefined)
      updateData.categories = Array.isArray(body.categories) ? body.categories : [];
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.specifications !== undefined) updateData.specifications = body.specifications;
    const incomingFaqs = Array.isArray(body.faqs) ? body.faqs : undefined;

    // Ensure product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If SKU is changing, ensure uniqueness
    if (updateData.sku && updateData.sku !== existing.sku) {
      const skuTaken = await prisma.product.findUnique({
        where: { sku: String(updateData.sku) },
      });
      if (skuTaken) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    // If faqs present, replace existing ProductFAQ relations with new ones
    if (incomingFaqs !== undefined) {
      // Remove existing ProductFAQ relations
      await prisma.productFAQ.deleteMany({ where: { productId: id } });

      // Create new FAQ entries and relations
      type IncomingFAQ = { question?: unknown; answer?: unknown };
      const faqCreates = (incomingFaqs as IncomingFAQ[])
        .filter((f) => f && typeof f.question === "string" && typeof f.answer === "string")
        .map((f) => ({
          faq: {
            create: {
              question: (f.question as string).trim(),
              answer: (f.answer as string).trim(),
            },
          },
        }));

      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
          ProductFAQ: faqCreates.length > 0 ? { create: faqCreates } : undefined,
        },
        include: { ProductFAQ: { include: { faq: true } } },
      });

      const out = { ...updated, faq: updated.ProductFAQ?.map((pf) => pf.faq) ?? [] };
      return NextResponse.json({ success: true, product: out }, { status: 200 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, product: updated }, { status: 200 });
  } catch (error) {
    console.error("API error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const authCheck = await requireAuth(req, ["seller", "admin"]);
  if (authCheck instanceof NextResponse) return authCheck;
  try {
    const params = await getParams(context as RouteContext);
    const id = params?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }
    const body = await req.json();

    // Build update data from only provided fields
    const updateData: Record<string, unknown> = {};
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.discountedPrice !== undefined)
      updateData.discountedPrice =
        body.discountedPrice === null ? null : Number(body.discountedPrice);
    if (body.sku !== undefined) updateData.sku = String(body.sku).trim();
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.images !== undefined)
      updateData.images = Array.isArray(body.images) ? body.images : [];
    if (body.categories !== undefined)
      updateData.categories = Array.isArray(body.categories) ? body.categories : [];
    if (body.specifications !== undefined) updateData.specifications = body.specifications;

    // Ensure product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If SKU is changing, ensure uniqueness
    if (updateData.sku && updateData.sku !== existing.sku) {
      const skuTaken = await prisma.product.findUnique({
        where: { sku: String(updateData.sku) },
      });
      if (skuTaken) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: { ProductFAQ: { include: { faq: true } } },
    });

    const out = { ...updated, faq: updated.ProductFAQ?.map((pf) => pf.faq) ?? [] };
    return NextResponse.json({ success: true, product: out }, { status: 200 });
  } catch (error) {
    console.error("API error patching product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const authCheck = await requireAuth(req, ["seller", "admin"]);
  if (authCheck instanceof NextResponse) return authCheck;
  try {
    const params = await getParams(context as RouteContext);
    const id = params?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    // Ensure product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from UploadThing
    if (existing.images && existing.images.length > 0) {
      try {
        // Extract keys from URLs if necessary, but utapi.deleteFiles often handles keys.
        // Assuming images are stored as full URLs, we need to extract the key.
        // Typical URL: https://utfs.io/f/KEY
        const imageKeys = existing.images.map((url) => {
          const parts = url.split("/");
          return parts[parts.length - 1];
        });
        await utapi.deleteFiles(imageKeys);
      } catch (error) {
        console.error("Failed to delete images from UploadThing:", error);
        // We continue with product deletion even if image deletion fails,
        // or we could throw to abort. Usually better to log and continue
        // to avoid blocking DB cleanup, but let's keep it simple.
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.productFAQ.deleteMany({ where: { productId: id } });
      await tx.bundleItem.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
