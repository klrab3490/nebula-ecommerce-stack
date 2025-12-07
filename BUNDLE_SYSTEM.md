# Bundle System Documentation

## Overview

The bundle system allows you to create product bundles with special pricing. It supports three bundle types:

1. **Combo**: 2 or more products for a special price (typically 20% off)
2. **Fixed Discount**: Products bundled with a fixed percentage discount
3. **BOGO**: Buy One Get One (free or discounted)

## Database Schema

### Bundle Model

```prisma
model Bundle {
  id            String       @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  description   String?
  bundleType    String       // "combo" | "fixed_discount" | "bogo"
  isActive      Boolean      @default(true)
  validFrom     DateTime     @default(now())
  validUntil    DateTime?

  // Auto-calculated pricing
  normalPrice   Float        // Sum of individual product prices
  offerPrice    Float        // Bundle price
  savings       Float        // normalPrice - offerPrice

  items         BundleItem[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
```

### BundleItem Model

```prisma
model BundleItem {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  bundle     Bundle   @relation(fields: [bundleId], references: [id])
  bundleId   String   @db.ObjectId
  product    Product  @relation(fields: [productId], references: [id])
  productId  String   @db.ObjectId
  quantity   Int      @default(1)
  isRequired Boolean  @default(true)
}
```

## API Endpoints

### GET /api/bundles

Fetch all active bundles with their items.

**Response:**

```json
{
  "bundles": [
    {
      "id": "bundle-id",
      "name": "Summer Combo",
      "bundleType": "combo",
      "normalPrice": 1000,
      "offerPrice": 800,
      "savings": 200,
      "items": [
        {
          "id": "item-id",
          "productId": "product-id",
          "quantity": 1,
          "isRequired": true,
          "product": {
            "id": "product-id",
            "name": "Product Name",
            "price": 500,
            "images": ["url"]
          }
        }
      ]
    }
  ]
}
```

### POST /api/bundles

Create a new bundle (seller/admin only).

**Request Body:**

```json
{
  "name": "Bundle Name",
  "description": "Bundle description",
  "bundleType": "combo",
  "validUntil": "2024-12-31T23:59:59Z",
  "items": [
    {
      "productId": "product-id-1",
      "quantity": 1,
      "isRequired": true
    },
    {
      "productId": "product-id-2",
      "quantity": 1,
      "isRequired": true
    }
  ]
}
```

### GET /api/bundles/by-product/[productId]

Get all bundles containing a specific product.

## Frontend Usage

### Cart Integration

The bundle system is integrated into the cart:

1. **Bundle Detection**: `BundleDetector` component automatically detects applicable bundles
2. **Bundle Card**: Shows bundle details, pricing, and savings
3. **Apply Bundle**: User clicks "Apply Bundle" to activate the offer
4. **Cart Summary**: Shows bundle savings in the total calculation

### Components

#### BundleOfferCard

Displays a bundle offer with pricing breakdown.

```tsx
<BundleOfferCard
  bundle={appliedBundle}
  onApply={() => handleApply()}
  onCancel={() => handleCancel()}
  isApplied={false}
  currency="₹"
/>
```

#### BundleDetector

Automatically detects and displays applicable bundles in the cart.

```tsx
<BundleDetector />
```

### Cart Item Warnings

When a user tries to remove a product that's part of an active bundle, a warning appears:

- **Visual indicator**: Products in bundles show "Part of bundle offer"
- **Warning message**: "Removing this will cancel the bundle offer"

## Backend Functions

### Find Bundles for Product

```typescript
import { findBundlesForProduct } from "@/lib/bundles";

const bundles = findBundlesForProduct(productId, allBundles);
```

### Check Bundle Applicability

```typescript
import { isBundleApplicable } from "@/lib/bundles";

const canApply = isBundleApplicable(bundle, cartItems);
```

### Calculate Bundle Pricing

```typescript
import { calculateBundlePrice } from "@/lib/bundles";

const pricing = calculateBundlePrice(bundle, cartItems);
// Returns: { applicable, normalPrice, offerPrice, savings, items }
```

### Get Applicable Bundles

```typescript
import { getApplicableBundles } from "@/lib/bundles";

const applicable = getApplicableBundles(cartItems, allBundles);
```

## Creating Bundles

### Example 1: Combo Bundle

```typescript
import { createComboBundle } from "@/lib/bundleHelpers";

const bundle = await createComboBundle(
  ["product-id-1", "product-id-2"],
  "Summer Skin Care Combo",
  "Get our bestselling moisturizer and sunscreen together!"
);
```

### Example 2: BOGO Bundle

```typescript
import { createBOGOBundle } from "@/lib/bundleHelpers";

const bundle = await createBOGOBundle(
  "product-id-1",
  "product-id-2",
  "Buy 1 Get 1 Free",
  100 // 100% off = free
);
```

### Example 3: Fixed Discount Bundle

```typescript
import { createFixedDiscountBundle } from "@/lib/bundleHelpers";

const bundle = await createFixedDiscountBundle(
  ["product-id-1", "product-id-2", "product-id-3"],
  "Complete Beauty Kit",
  15 // 15% off
);
```

## Cart Flow

1. **User adds products to cart**
2. **BundleDetector checks for applicable bundles**
3. **Bundle card is shown if products match a bundle**
4. **User clicks "Apply Bundle"**
5. **Cart recalculates with bundle pricing**
6. **Cart summary shows bundle savings**
7. **If user removes required item, warning is shown**

## Testing the Bundle System

### Step 1: Create Products

First, ensure you have products in your database.

### Step 2: Create a Bundle

Use the POST /api/bundles endpoint or the helper functions:

```bash
curl -X POST http://localhost:3000/api/bundles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bundle",
    "bundleType": "combo",
    "items": [
      {"productId": "product-1", "quantity": 1, "isRequired": true},
      {"productId": "product-2", "quantity": 1, "isRequired": true}
    ]
  }'
```

### Step 3: Add Products to Cart

Add the bundled products to your cart.

### Step 4: View Bundle Offer

Navigate to `/cart` and see the bundle offer card.

### Step 5: Apply Bundle

Click "Apply Bundle" to activate the offer and see the savings.

## Configuration

### Discount Percentages

Default discount percentages can be adjusted in the API route:

- **Combo**: 20% off (0.8 multiplier)
- **Fixed Discount**: 10% off (0.9 multiplier)
- **BOGO**: 50% off (0.5 multiplier)

### Bundle Types

Supported bundle types:

- `combo`: Products bundled together at a discount
- `fixed_discount`: Fixed percentage discount
- `bogo`: Buy one get one offer

## Troubleshooting

### Bundles Not Showing in Cart

1. Check if bundle is active: `isActive: true`
2. Check if bundle is valid: `validUntil` not expired
3. Verify all required products are in cart
4. Check console for errors

### Bundle Not Applying

1. Ensure all required items are in cart
2. Check product IDs match exactly
3. Verify bundle fetch in AppContext

### Price Calculation Issues

1. Check `normalPrice` and `offerPrice` in database
2. Verify `calculateCartWithBundles` logic
3. Check cart summary calculation

## Migration

Run Prisma migration after updating the schema:

```bash
npx prisma generate
npx prisma db push
```

## Future Enhancements

- [ ] Multiple bundle application (non-overlapping)
- [ ] Quantity-based bundles (buy 3, get 1 free)
- [ ] Time-limited flash bundles
- [ ] User-specific bundle recommendations
- [ ] Bundle analytics and performance tracking
