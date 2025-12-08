/**
 * Bundle Creation and Management Examples
 *
 * This file contains example functions for creating and managing bundles in the e-commerce system.
 */

import { prisma } from "@/lib/prisma";

/**
 * Example: Create a Combo Bundle (2 products for a special price)
 * Bundle Type: "combo"
 * Use Case: Buy 2 specific products together at 20% off
 */
export async function createComboBundle(
  productIds: string[],
  bundleName: string,
  description?: string
) {
  // Fetch product prices
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, discountedPrice: true },
  });

  // Calculate normal price (sum of individual prices)
  const normalPrice = products.reduce((sum, p) => sum + (p.discountedPrice || p.price), 0);

  // Combo bundles typically offer 20% discount
  const offerPrice = normalPrice * 0.8;
  const savings = normalPrice - offerPrice;

  const bundle = await prisma.bundle.create({
    data: {
      name: bundleName,
      description: description || `Get ${products.length} products together at a special price!`,
      bundleType: "combo",
      normalPrice,
      offerPrice,
      savings,
      items: {
        create: productIds.map((productId) => ({
          productId,
          quantity: 1,
          isRequired: true, // All items required for combo
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return bundle;
}

/**
 * Example: Create a Fixed Discount Bundle
 * Bundle Type: "fixed_discount"
 * Use Case: Buy specific products together and get a fixed discount
 */
export async function createFixedDiscountBundle(
  productIds: string[],
  bundleName: string,
  discountPercentage: number = 10,
  description?: string
) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, discountedPrice: true },
  });

  const normalPrice = products.reduce((sum, p) => sum + (p.discountedPrice || p.price), 0);

  const offerPrice = normalPrice * (1 - discountPercentage / 100);
  const savings = normalPrice - offerPrice;

  const bundle = await prisma.bundle.create({
    data: {
      name: bundleName,
      description: description || `Save ${discountPercentage}% when you buy these together!`,
      bundleType: "fixed_discount",
      normalPrice,
      offerPrice,
      savings,
      items: {
        create: productIds.map((productId) => ({
          productId,
          quantity: 1,
          isRequired: true,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return bundle;
}

/**
 * Example: Create a BOGO (Buy One Get One) Bundle
 * Bundle Type: "bogo"
 * Use Case: Buy one product, get another at 50% off or free
 */
export async function createBOGOBundle(
  buyProductId: string,
  getProductId: string,
  bundleName: string,
  getDiscount: number = 100, // 100% = free, 50% = half off
  description?: string
) {
  const products = await prisma.product.findMany({
    where: { id: { in: [buyProductId, getProductId] } },
    select: { id: true, price: true, discountedPrice: true },
  });

  const buyProduct = products.find((p) => p.id === buyProductId);
  const getProduct = products.find((p) => p.id === getProductId);

  if (!buyProduct || !getProduct) {
    throw new Error("Products not found");
  }

  const normalPrice =
    (buyProduct.discountedPrice || buyProduct.price) +
    (getProduct.discountedPrice || getProduct.price);

  // Apply discount to the "get" product
  const getProductDiscount = ((getProduct.discountedPrice || getProduct.price) * getDiscount) / 100;
  const offerPrice = normalPrice - getProductDiscount;
  const savings = getProductDiscount;

  const bundle = await prisma.bundle.create({
    data: {
      name: bundleName,
      description:
        description || `Buy one, get ${getDiscount === 100 ? "one free" : `${getDiscount}% off`}!`,
      bundleType: "bogo",
      normalPrice,
      offerPrice,
      savings,
      items: {
        create: [
          {
            productId: buyProductId,
            quantity: 1,
            isRequired: true,
          },
          {
            productId: getProductId,
            quantity: 1,
            isRequired: true,
          },
        ],
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return bundle;
}

// Example: Update bundle pricing
export async function updateBundlePricing(bundleId: string, newOfferPrice: number) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    select: { normalPrice: true },
  });

  if (!bundle) {
    throw new Error("Bundle not found");
  }

  const savings = bundle.normalPrice - newOfferPrice;

  return await prisma.bundle.update({
    where: { id: bundleId },
    data: {
      offerPrice: newOfferPrice,
      savings,
    },
  });
}

// Example: Deactivate a bundle
export async function deactivateBundle(bundleId: string) {
  return await prisma.bundle.update({
    where: { id: bundleId },
    data: { isActive: false },
  });
}

// Example: Get all bundles for a product
export async function getBundlesForProduct(productId: string) {
  return await prisma.bundle.findMany({
    where: {
      isActive: true,
      items: {
        some: { productId },
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
    orderBy: { savings: "desc" },
  });
}
