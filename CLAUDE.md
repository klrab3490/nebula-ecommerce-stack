# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build for production (runs prisma generate first)
npm start            # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run Jest tests (use --passWithNoTests flag)
```

### Database

```bash
npx prisma generate  # Regenerate Prisma client after schema changes
```

### Testing

```bash
npm test                           # Run all tests
npx jest path/to/file.test.ts     # Run a specific test file
npx jest --watch                   # Run tests in watch mode
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: MongoDB via Prisma ORM v6.19+ (NOT mongoose - despite it being in package.json)
  - **IMPORTANT**: This project uses Prisma 6, not Prisma 7. Prisma 7 has breaking changes in schema configuration that are incompatible with the current setup.
- **Auth**: Clerk (`@clerk/nextjs`) for authentication and user management
- **Payments**: Razorpay integration (test mode supported)
- **File Uploads**: UploadThing for product images (4MB limit)
- **Styling**: TailwindCSS 4 with Radix UI components and shadcn/ui patterns
- **Forms**: react-hook-form + Zod validation
- **Testing**: Jest + React Testing Library

### Key Architecture Patterns

#### Database Access

- Single Prisma client instance exported from `lib/prisma.ts`
- Singleton pattern prevents multiple instances in development hot reload
- All database operations use Prisma Client (MongoDB provider)
- **Never use mongoose** - it's an unused dependency

#### Authentication Flow

- Clerk manages auth sessions via cookies and server components
- User sync happens in `AppContext` (client) and via `/api/user` route (server)
- Server-side auth helpers in `lib/authSeller.ts`:
  - `getServerUser()` - get current Clerk user on server
  - `requireAuth(req, allowedRoles)` - protect API routes with role checking
  - `validateSessionMatchesUserId(clerkId)` - verify session ownership
- User roles stored in Clerk's `publicMetadata.role` (buyer/seller)
- Role-based access: seller role required for `/app/seller/*` pages and admin features

#### State Management

- Global app state in `contexts/AppContext.tsx` using React Context
- Cart state uses `useReducer` for complex state logic with bundle discount calculations
- Cart persists to localStorage automatically
- Bundle discounts calculated on every cart change via reducer
- Context provides: user data, cart operations, bundle management, currency, router

#### Cart & Bundle System

- Cart items stored as `CartItem[]` with id, name, price, quantity, image, variant
- Bundle discount engine in `lib/bundles.ts`:
  - `calculateBundleDiscounts()` - find all applicable bundle discounts
  - `applyBestBundleDiscounts()` - select best non-overlapping discounts
  - Supports three discount types: percentage, fixed, buy_x_get_y
  - Validates bundle active status, date ranges, min/max quantities
  - Prevents overlapping bundles (same product can't be in multiple active bundles)
- Bundle data fetched from `/api/bundles` on app mount
- Discounts auto-recalculate when cart or bundles change

#### API Routes Structure

All API routes follow Next.js App Router conventions in `app/api/`:

- `POST /api/user` - sync Clerk user to database
- `GET /api/products` - fetch all products with optional filters
- `GET /api/products/[id]` - fetch single product
- `POST /api/products` - create product (seller only)
- `GET /api/bundles` - fetch active bundles with product details
- `POST /api/bundles` - create bundle (seller only)
- `POST /api/user/address` - create address for user
- `GET /api/user/address` - fetch user addresses
- `POST /api/uploadthing` - UploadThing file upload handler

#### Checkout & Payment Flow

1. **Cart** → `/cart` page displays cart items and bundle discounts
2. **Checkout** → `/checkout` page collects shipping info and creates order
   - Calls `POST /api/checkout/create-order` with cart data
   - Creates Order in DB with status "pending"
3. **Payment** → Client calls `POST /api/checkout/razorpay/create-order`
   - Server creates Razorpay order
   - Returns { key, orderId, amount, currency }
   - Client opens Razorpay popup (loaded via script in layout.tsx)
4. **Verification** → After payment, client posts to `POST /api/checkout/razorpay/verify`
   - Server verifies signature using crypto.createHmac
   - Updates order status to "paid"
5. **Success** → Redirect to `/checkout/success`

**Important Payment Notes**:

- Current implementation uses `findFirst({ status: 'pending' })` - NOT production ready
- For production: pass explicit orderId through flow to avoid race conditions
- Add server-side cart validation before order creation
- Implement Razorpay webhooks for async events
- Shiprocket integration is a placeholder - needs real API implementation

#### Component Organization

- `components/ui/` - Base shadcn/ui components (Button, Card, Dialog, etc.)
- `components/custom/` - App-specific components
  - `cart/` - Cart display components (cart-icon, cart-items, cart-summery)
  - `bundles/` - Bundle management UI (BundleCard, BundleManagement, CartBundleDiscounts)
  - `dashboard/` - Seller dashboard widgets (metrics, charts, quick actions)
  - `seller/` - Seller-specific client components (analytics, customers, orders, sidebar)
- `components/checkout/` - Payment components (RazorpayCheckout)
- `components/theme/` - Dark mode toggle and theme provider

#### Route Structure

- `/` - Home page with hero, featured products, categories
- `/products` - Product listing with filters
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout flow (address, payment method selection)
- `/checkout/success` - Post-payment success page
- `/account` - User account management
- `/account/address` - Address management
- `/my-orders` - User's order history
- `/seller/*` - Seller dashboard (protected by role check)
  - `/seller` - Dashboard overview
  - `/seller/products` - Product management
  - `/seller/orders` - Order management
  - `/seller/customers` - Customer list

### Database Schema (Prisma)

Located at `prisma/schema.prisma`. Key models:

**User** - Synced from Clerk, stores role and addresses

- Links to Clerk via `clerkId` (unique)
- Has many `Address` records

**Product** - E-commerce products

- Fields: name, description, price, discountedPrice, sku, stock, images[], categories[], featured
- Relations: OrderProduct, ProductFAQ, BundleProduct

**Bundle** - Product bundles with discounts

- Discount types: percentage, fixed, buy_x_get_y
- Fields: name, description, discountType, discountValue, minQuantity, maxQuantity
- Validity: isActive, validFrom, validUntil
- Relations: BundleProduct (products in bundle), OrderProduct

**Order** - Purchase orders

- Fields: userId, total, status, products (OrderProduct[])
- Status values: "pending", "paid", etc.

**OrderProduct** - Join table for Order ↔ Product many-to-many

- Includes quantity and optional bundleId reference

**Address** - User shipping addresses

- Fields: name, street, city, state, zipCode, country, phone, isDefault

**FAQ & ProductFAQ** - Product FAQs via join table

### Environment Variables

Required in `.env.local`:

```bash
# Currency
NEXT_PUBLIC_CURRENCY=INR

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB
DATABASE_URL=mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority

# UploadThing
UPLOADTHING_TOKEN=...

# Razorpay (for payments)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### TypeScript Path Aliases

`@/*` maps to project root - use `@/components/...`, `@/lib/...`, `@/contexts/...` in imports

### Testing Strategy

- Tests located in `__tests__/` directory
- Mirrors source structure: `__tests__/lib/`, `__tests__/api/`
- Test files use `.test.ts` or `.test.tsx` extension
- Jest configured with Next.js preset via `jest.config.ts`
- Setup file: `jest.setup.ts` (loaded via setupFilesAfterEnv)
- Path alias `@/*` configured in moduleNameMapper
- Coverage targets currently at 0% (coverage collection configured but not enforced)
- Example: See `__tests__/lib/bundles.test.ts` for bundle discount logic tests

### Important Implementation Notes

1. **Prisma Client Generation**: Runs automatically on `npm install` via postinstall script. Always regenerate after schema changes.

2. **Clerk Role Management**: Roles are stored in Clerk's `publicMetadata.role` field (not in your database). Access via `user.publicMetadata.role` in components and `requireAuth()` in API routes.

3. **File Uploads**: UploadThing requires `UPLOADTHING_TOKEN` env var. Configuration in `app/api/uploadthing/core.ts`. Use `UploadButton` or `UploadDropzone` components from `utils/uploadthing.ts`.

4. **Bundle Discount Priority**: When multiple bundles apply to overlapping products, the algorithm selects the highest discount first, then finds non-overlapping bundles. See `applyBestBundleDiscounts()` in `lib/bundles.ts`.

5. **Cart Persistence**: Cart automatically syncs to localStorage on every change. Loaded on mount in `AppContext`.

6. **Razorpay Script**: Loaded globally in `app/layout.tsx` via Next.js `<Script>` component with `strategy="afterInteractive"`.

7. **Theme Support**: Dark mode implemented via `next-themes`. ThemeProvider in layout, ModeToggle component for switching.

8. **Server vs Client Components**: Most page components are server components by default. Client components explicitly use `"use client"` directive (e.g., AppContext, cart components, theme toggle).

9. **API Route Protection**: Use `requireAuth(req, ['seller'])` at the start of API routes that need role protection. Returns NextResponse error if unauthorized, or user object if valid.

10. **Database Queries**: Always use Prisma Client from `lib/prisma.ts`. Common pattern:

```typescript
import { prisma } from "@/lib/prisma";
const products = await prisma.product.findMany({ where: { featured: true } });
```

## Common Workflows

### Adding a New Product via Seller Dashboard

1. Navigate to `/seller/products/new`
2. Form uses react-hook-form + Zod validation
3. Images uploaded via UploadThing (returns URLs)
4. Submits to `POST /api/products` (requires seller role)
5. Prisma creates product with generated ObjectId

### Creating a Bundle Discount

1. Use `POST /api/bundles` endpoint (seller only)
2. Specify products via BundleProduct array (productId, quantity, isRequired)
3. Set discount type (percentage/fixed/buy_x_get_y) and value
4. Bundle becomes active immediately if isActive=true
5. Cart automatically applies discount when conditions met

### User Registration Flow

1. User signs up via Clerk UI components
2. Clerk creates user session
3. `AppContext` detects user via `useUser()` hook
4. Calls `POST /api/user` to sync user to MongoDB
5. User can now place orders (userId linked to Order model)

### Running Tests After Code Changes

1. Make changes to source files
2. Run `npm test` to verify all tests pass
3. For specific file: `npx jest __tests__/path/to/file.test.ts`
4. Add new tests in `__tests__/` mirroring source structure

## Rules

- Before you do any work, MUST view files in .claude/tasks/context_session_x.md file to get the full context (x being the id of the session we are operate, if file doesn't exist, then create one)
- context_session_x.md should contain most of context of what we did, overall plan, and sub agents will continuosly add context to the file
- After you finish the work, MUST update the .claude/tasks/context_session_x.md file to make sure others can get full context of what you did

### Sub agent

You have access to 1 sub agent

- shadcn-ui-architect: all task related to UI building & tweaking HAVE TO consult this agent
  Sub agents will do research about the implementation, but you will do the actual implementation;
  When passing task to sub agent, make sure you pass the context file, e.g. .claude/tasks/context_session_x.md
  After each sub agent finish the work, make sure you read the related documentation they created to get full context of the plan before you start executing
