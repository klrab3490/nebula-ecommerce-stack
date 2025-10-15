import { CartItem } from '@/contexts/AppContext'

export interface Bundle {
  id: string
  name: string
  description: string
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y'
  discountValue: number
  minQuantity: number
  maxQuantity?: number
  isActive: boolean
  validFrom: Date
  validUntil?: Date
  BundleProduct: BundleProduct[]
}

export interface BundleProduct {
  id: string
  bundleId: string
  productId: string
  quantity: number
  isRequired: boolean
  product: {
    id: string
    name: string
    price: number
    discountedPrice?: number
    images: string[]
    stock: number
  }
}

export interface BundleDiscount {
  bundleId: string
  bundleName: string
  discount: number
  originalPrice: number
  discountedPrice: number
  appliedProducts: string[]
}

/**
 * Calculate bundle discounts for cart items
 */
export function calculateBundleDiscounts(
  cartItems: CartItem[],
  bundles: Bundle[]
): BundleDiscount[] {
  const discounts: BundleDiscount[] = []

  for (const bundle of bundles) {
    if (!bundle.isActive) continue
    
    // Check if bundle is still valid
    const now = new Date()
    if (bundle.validUntil && bundle.validUntil < now) continue

    const bundleDiscount = calculateSingleBundleDiscount(cartItems, bundle)
    if (bundleDiscount) {
      discounts.push(bundleDiscount)
    }
  }

  return discounts
}

/**
 * Calculate discount for a single bundle
 */
function calculateSingleBundleDiscount(
  cartItems: CartItem[],
  bundle: Bundle
): BundleDiscount | null {
  // Check if all required products are in cart with sufficient quantity
  const requiredProducts = bundle.BundleProduct.filter(bp => bp.isRequired)
  const optionalProducts = bundle.BundleProduct.filter(bp => !bp.isRequired)

  let totalQuantityInBundle = 0
  let originalPrice = 0
  const appliedProducts: string[] = []

  // Check required products
  for (const bundleProduct of requiredProducts) {
    const cartItem = cartItems.find(item => item.id === bundleProduct.productId)
    if (!cartItem || cartItem.quantity < bundleProduct.quantity) {
      return null // Required product not in cart or insufficient quantity
    }
    
    const usedQuantity = Math.min(cartItem.quantity, bundleProduct.quantity)
    totalQuantityInBundle += usedQuantity
    originalPrice += (bundleProduct.product.discountedPrice || bundleProduct.product.price) * usedQuantity
    appliedProducts.push(bundleProduct.productId)
  }

  // Add optional products if available
  for (const bundleProduct of optionalProducts) {
    const cartItem = cartItems.find(item => item.id === bundleProduct.productId)
    if (cartItem && cartItem.quantity >= bundleProduct.quantity) {
      const usedQuantity = Math.min(cartItem.quantity, bundleProduct.quantity)
      totalQuantityInBundle += usedQuantity
      originalPrice += (bundleProduct.product.discountedPrice || bundleProduct.product.price) * usedQuantity
      appliedProducts.push(bundleProduct.productId)
    }
  }

  // Check minimum quantity requirement
  if (totalQuantityInBundle < bundle.minQuantity) {
    return null
  }

  // Check maximum quantity limit
  if (bundle.maxQuantity && totalQuantityInBundle > bundle.maxQuantity) {
    totalQuantityInBundle = bundle.maxQuantity
  }

  // Calculate discount based on type
  let discount = 0
  let discountedPrice = originalPrice

  switch (bundle.discountType) {
    case 'percentage':
      discount = (originalPrice * bundle.discountValue) / 100
      discountedPrice = originalPrice - discount
      break
    
    case 'fixed':
      discount = Math.min(bundle.discountValue, originalPrice)
      discountedPrice = originalPrice - discount
      break
    
    case 'buy_x_get_y':
      // For buy X get Y, discountValue represents the number of free items
      // This is a simplified implementation - you might want to customize based on your needs
      const freeItems = Math.floor(totalQuantityInBundle / bundle.minQuantity) * bundle.discountValue
      const avgPrice = originalPrice / totalQuantityInBundle
      discount = freeItems * avgPrice
      discountedPrice = originalPrice - discount
      break
  }

  return {
    bundleId: bundle.id,
    bundleName: bundle.name,
    discount,
    originalPrice,
    discountedPrice,
    appliedProducts
  }
}

/**
 * Apply the best bundle discounts to cart (non-overlapping)
 */
export function applyBestBundleDiscounts(
  cartItems: CartItem[],
  bundles: Bundle[]
): {
  appliedDiscounts: BundleDiscount[]
  totalDiscount: number
  finalTotal: number
} {
  const availableDiscounts = calculateBundleDiscounts(cartItems, bundles)
  
  // Sort by discount amount (highest first)
  availableDiscounts.sort((a, b) => b.discount - a.discount)
  
  const appliedDiscounts: BundleDiscount[] = []
  const usedProducts = new Set<string>()
  
  // Apply non-overlapping discounts
  for (const discount of availableDiscounts) {
    const hasOverlap = discount.appliedProducts.some(productId => usedProducts.has(productId))
    
    if (!hasOverlap) {
      appliedDiscounts.push(discount)
      discount.appliedProducts.forEach(productId => usedProducts.add(productId))
    }
  }
  
  const totalDiscount = appliedDiscounts.reduce((sum, discount) => sum + discount.discount, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const finalTotal = Math.max(0, originalTotal - totalDiscount)
  
  return {
    appliedDiscounts,
    totalDiscount,
    finalTotal
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount)
}