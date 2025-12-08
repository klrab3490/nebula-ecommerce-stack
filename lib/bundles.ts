import { CartItem } from "@/contexts/AppContext";

export interface BundleItemData {
  id: string;
  bundleId: string;
  productId: string;
  quantity: number;
  isRequired: boolean;
  product?: {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
    images: string[];
    stock: number;
  };
}

export interface Bundle {
  id: string;
  name: string;
  description?: string;
  bundleType: "combo" | "fixed_discount" | "bogo";
  normalPrice: number;
  offerPrice: number;
  savings: number;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  items: BundleItemData[];
}

export interface AppliedBundle {
  bundleId: string;
  bundleName: string;
  bundleType: string;
  normalPrice: number;
  offerPrice: number;
  savings: number;
  requiredItems: string[]; // product IDs
  appliedItems: string[]; // product IDs in cart that matched
}

// Find bundles that contain a specific product
export function findBundlesForProduct(productId: string, bundles: Bundle[]): Bundle[] {
  return bundles.filter(
    (bundle) =>
      bundle.isActive &&
      (!bundle.validUntil || bundle.validUntil > new Date()) &&
      bundle.items.some((item) => item.productId === productId)
  );
}

// Check if all required items of a bundle are in the cart
export function isBundleApplicable(bundle: Bundle, cartItems: CartItem[]): boolean {
  const requiredItems = bundle.items.filter((item) => item.isRequired);

  return requiredItems.every((bundleItem) => {
    const cartItem = cartItems.find((item) => item.id === bundleItem.productId);
    return cartItem && cartItem.quantity >= bundleItem.quantity;
  });
}

// Get all applicable bundles for current cart
export function getApplicableBundles(cartItems: CartItem[], bundles: Bundle[]): Bundle[] {
  return bundles.filter(
    (bundle) =>
      bundle.isActive &&
      (!bundle.validUntil || bundle.validUntil > new Date()) &&
      isBundleApplicable(bundle, cartItems)
  );
}

// Calculate total price for a specific bundle if applied
export function calculateBundlePrice(
  bundle: Bundle,
  cartItems: CartItem[]
): {
  applicable: boolean;
  normalPrice: number;
  offerPrice: number;
  savings: number;
  items: string[];
} {
  const requiredItems = bundle.items.filter((item) => item.isRequired);
  let normalPrice = 0;
  const appliedItems: string[] = [];

  // Check required items
  for (const bundleItem of requiredItems) {
    const cartItem = cartItems.find((item) => item.id === bundleItem.productId);
    if (!cartItem || cartItem.quantity < bundleItem.quantity) {
      return {
        applicable: false,
        normalPrice: 0,
        offerPrice: 0,
        savings: 0,
        items: [],
      };
    }
    normalPrice += cartItem.price * bundleItem.quantity;
    appliedItems.push(bundleItem.productId);
  }

  // Add optional items if present
  for (const bundleItem of bundle.items.filter((item) => !item.isRequired)) {
    const cartItem = cartItems.find((item) => item.id === bundleItem.productId);
    if (cartItem && cartItem.quantity >= bundleItem.quantity) {
      normalPrice += cartItem.price * bundleItem.quantity;
      appliedItems.push(bundleItem.productId);
    }
  }

  const savings = Math.max(0, normalPrice - bundle.offerPrice);

  return {
    applicable: true,
    normalPrice,
    offerPrice: bundle.offerPrice,
    savings,
    items: appliedItems,
  };
}

// Get all applied bundles in cart (best matching first)
export function getAppliedBundles(cartItems: CartItem[], bundles: Bundle[]): AppliedBundle[] {
  const applicable = getApplicableBundles(cartItems, bundles);

  // Sort by savings (highest first) to get the best bundles
  const withPrices = applicable.map((bundle) => ({
    bundle,
    pricing: calculateBundlePrice(bundle, cartItems),
  }));

  withPrices.sort((a, b) => b.pricing.savings - a.pricing.savings);

  return withPrices.map(({ bundle, pricing }) => ({
    bundleId: bundle.id,
    bundleName: bundle.name,
    bundleType: bundle.bundleType,
    normalPrice: pricing.normalPrice,
    offerPrice: pricing.offerPrice,
    savings: pricing.savings,
    requiredItems: bundle.items.filter((item) => item.isRequired).map((item) => item.productId),
    appliedItems: pricing.items,
  }));
}

// Calculate final cart total with best bundle applied
export function calculateCartWithBundles(
  cartItems: CartItem[],
  bundles: Bundle[]
): {
  subtotal: number;
  bundleSavings: number;
  appliedBundles: AppliedBundle[];
  total: number;
} {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const appliedBundles = getAppliedBundles(cartItems, bundles);

  // Use the first (best) bundle if available
  const bestBundle = appliedBundles[0];
  const bundleSavings = bestBundle ? bestBundle.savings : 0;
  const total = Math.max(0, subtotal - bundleSavings);

  return {
    subtotal,
    bundleSavings,
    appliedBundles: bestBundle ? [bestBundle] : [],
    total,
  };
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
