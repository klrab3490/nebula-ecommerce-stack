import { prisma } from "@/lib/prisma";
import { ApiErrors } from "./apiErrorHandler";

export interface CartItem {
  id: string; // Product ID
  quantity: number;
  price?: number;
  name?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount?: number;
}

export interface ValidatedCartItem extends CartItem {
  price: number;
  name: string;
  actualPrice: number; // Current price from database
  stock: number;
}

export interface ValidatedCart {
  items: ValidatedCartItem[];
  calculatedTotal: number;
  providedTotal: number;
  isValid: boolean;
  errors: string[];
}

/**
 * Validate cart items and calculate server-side total
 *
 * Checks:
 * - All products exist in database
 * - All products have sufficient stock
 * - Prices match current database prices
 * - Total is correctly calculated
 */
export async function validateCart(cart: Cart): Promise<ValidatedCart> {
  const errors: string[] = [];

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw ApiErrors.BadRequest("Cart is empty or invalid");
  }

  // Fetch all products from database
  const productIds = cart.items.map((item) => item.id);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      name: true,
      price: true,
      discountedPrice: true,
      stock: true,
    },
  });

  // Create product lookup map
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Validate each cart item
  const validatedItems: ValidatedCartItem[] = [];
  let calculatedTotal = 0;

  for (const item of cart.items) {
    const product = productMap.get(item.id);

    // Check if product exists
    if (!product) {
      errors.push(`Product not found: ${item.id}`);
      continue;
    }

    // Check stock availability
    if (product.stock < item.quantity) {
      errors.push(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }

    // Use discounted price if available, otherwise regular price
    const actualPrice = product.discountedPrice || product.price;
    const itemTotal = actualPrice * item.quantity;
    calculatedTotal += itemTotal;

    validatedItems.push({
      id: item.id,
      quantity: item.quantity,
      price: item.price || actualPrice,
      name: product.name,
      actualPrice,
      stock: product.stock,
    });
  }

  // Verify total matches (allow 1 cent difference for rounding)
  const totalDifference = Math.abs(calculatedTotal - cart.total);
  if (totalDifference > 0.01) {
    errors.push(`Cart total mismatch. Provided: ${cart.total}, Calculated: ${calculatedTotal}`);
  }

  return {
    items: validatedItems,
    calculatedTotal,
    providedTotal: cart.total,
    isValid: errors.length === 0,
    errors,
  };
}

// Validate cart and throw error if invalid
export async function validateCartOrThrow(cart: Cart): Promise<ValidatedCart> {
  const validation = await validateCart(cart);

  if (!validation.isValid) {
    console.error("Cart validation failed:", {
      errors: validation.errors,
      providedTotal: validation.providedTotal,
      calculatedTotal: validation.calculatedTotal,
      items: validation.items,
    });
    throw ApiErrors.BadRequest("Cart validation failed", { errors: validation.errors });
  }

  return validation;
}
