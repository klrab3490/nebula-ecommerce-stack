# TASK LIST - MISSING & INCOMPLETE FEATURES

## Core Features

- Implement product search with text filtering (name, description, SKU)
- Add product filtering by category, price range, stock status on `/products` page
- Implement pagination for product listings
- Add product reviews and ratings system (schema, API, UI)
- Build wishlist functionality (add/remove, persist, display)
- Add product variants system (colors, sizes) with SKU/stock tracking per variant
- Implement coupon/promo code system (schema, validation, cart integration)
- Add email notifications (order confirmation, shipping updates, password reset)
- Build order tracking system with status history
- Add refund/cancellation workflow (buyer request, seller approval, Razorpay refund API)
- Implement multi-currency support (extend beyond INR)
- Add tax calculation logic (GST/VAT based on shipping address)
- Add shipping cost calculation (flat rate, weight-based, or carrier API)
- Build in-app notification system (toasts, notification center)

## Seller Dashboard Improvements

- Add product update/edit page at `/seller/products/[id]/edit`
- Add product delete with confirmation dialog
- Add bulk product operations (bulk delete, bulk price update, CSV import/export)
- Implement bundle edit/delete functionality
- Add order status update UI (mark as shipped, delivered, cancelled)
- Build inventory alerts (low stock warnings, out-of-stock notifications)
- Add inventory adjustment UI (manual stock updates, reasons tracking)
- Implement sales analytics charts (revenue over time, top products, conversion rates)
- Add customer analytics (lifetime value, repeat purchase rate)
- Build export functionality (orders CSV, sales reports)
- Add seller profile/settings page
- Implement shipping label generation integration (Shiprocket API)

## Buyer Experience Improvements

- Add product image gallery with zoom on `/products/[id]`
- Implement related products section
- Add recently viewed products
- Build comparison tool (compare multiple products side-by-side)
- Add "Continue Shopping" CTA on cart/checkout
- Implement guest checkout (no account required)
- Add order invoice PDF generation and download
- Build return/exchange request system
- Add saved payment methods (if supported by Razorpay)
- Implement address autocomplete (Google Places API)

## API Improvements

- Fix race condition in checkout flow - pass explicit `orderId` through payment flow (`app/api/checkout/`)
- Add server-side cart validation before order creation (`POST /api/checkout/create-order`)
- Implement Razorpay webhook handler (`POST /api/webhooks/razorpay`) for payment events
- Add rate limiting middleware for all API routes
- Implement API request/response logging
- Add input sanitization for all user inputs
- Build product search API with fuzzy matching (`GET /api/products/search`)
- Add `PUT /api/products/[id]` for product updates
- Add `DELETE /api/products/[id]` for product deletion
- Add `PUT /api/bundles/[id]` and `DELETE /api/bundles/[id]`
- Implement `PATCH /api/orders/[id]` for status updates
- Add `POST /api/reviews` and `GET /api/products/[id]/reviews`
- Add `POST /api/wishlist` and `GET /api/wishlist`
- Implement `POST /api/coupons/validate` for coupon validation
- Add pagination support to all list endpoints (products, orders, customers)

## Database/Prisma Improvements

- Add Review model to schema (productId, userId, rating, comment, createdAt)
- Add Wishlist model (userId, productId[], createdAt)
- Add Coupon model (code, discountType, value, validFrom, validUntil, usageLimit)
- Add OrderStatusHistory model (orderId, status, timestamp, note)
- Add database indexes for performance (userId, productId, clerkId, sku, status fields)
- Create Prisma seed script (`prisma/seed.ts`) with sample data
- Set up database migration workflow (document how to create/apply migrations)
- Add ProductVariant model (productId, name, sku, price, stock, attributes)
- Add ShippingRate model (country, weight ranges, cost)
- Add TaxRate model (country, state, rate)

## Checkout & Razorpay Productionization

- Replace `findFirst({ status: 'pending' })` with explicit orderId handling (`app/api/checkout/razorpay/verify/route.ts`)
- Add server-side cart total validation (verify cart total matches order total)
- Implement Razorpay webhook signature verification (`app/api/webhooks/razorpay/route.ts`)
- Add webhook event handling (payment.failed, payment.captured, refund.created)
- Handle payment failures gracefully (retry logic, error messages)
- Add order timeout mechanism (cancel pending orders after X minutes)
- Implement idempotency keys for Razorpay API calls
- Add support for partial payments/installments if needed
- Replace Shiprocket placeholder with real API integration (`app/api/shipping/`)
- Add COD (Cash on Delivery) payment method implementation

## Testing (Jest)

- Add tests for all API routes in `__tests__/api/`
  - `products/route.test.ts`
  - `products/[id]/route.test.ts`
  - `bundles/route.test.ts`
  - `user/route.test.ts`
  - `user/address/route.test.ts`
  - `checkout/create-order/route.test.ts`
  - `checkout/razorpay/create-order/route.test.ts`
  - `checkout/razorpay/verify/route.test.ts`
- Add component tests for critical components
  - `__tests__/components/cart/cart-items.test.tsx`
  - `__tests__/components/bundles/CartBundleDiscounts.test.tsx`
  - `__tests__/components/checkout/RazorpayCheckout.test.tsx`
- Add integration tests for checkout flow
- Add E2E tests with Playwright (add to package.json, create `e2e/` directory)
- Increase test coverage to at least 60% for lib/, 40% for API routes
- Mock Prisma client in tests properly
- Mock Clerk auth helpers in API route tests
- Add tests for `lib/authSeller.ts` functions

## Performance & Caching

- Add Redis caching layer for frequently accessed data (products, bundles)
- Implement React Query or SWR for client-side data fetching and caching
- Add Next.js image optimization for product images
- Implement lazy loading for product images
- Add skeleton loaders for async data fetching
- Optimize bundle images for different screen sizes (srcset)
- Add database query optimization (reduce N+1 queries)
- Implement incremental static regeneration (ISR) for product pages
- Add service worker for offline support (optional PWA)
- Optimize bundle size (analyze with `@next/bundle-analyzer`)

## Security & Auth

- Add CSRF protection for state-changing requests
- Implement rate limiting on authentication endpoints
- Add input validation schemas for all API routes (extend Zod usage)
- Sanitize HTML in user-generated content (reviews, descriptions)
- Add Content Security Policy headers
- Implement API request throttling per user
- Add SQL injection protection for dynamic queries
- Validate file uploads (type, size, malware scanning)
- Add session timeout and refresh logic
- Implement audit logging for sensitive operations (order creation, payment)
- Add environment variable validation on startup (check all required vars exist)
- Secure Razorpay webhook endpoint (IP whitelisting)

## DX / Code Quality

- Remove unused mongoose dependency from package.json
- Add API documentation (Swagger/OpenAPI spec or TypeDoc)
- Create component documentation (Storybook setup)
- Add error boundaries for React components
- Implement global error handling middleware for API routes
- Add TypeScript strict mode in tsconfig.json
- Create pre-commit hooks (Husky + lint-staged) for linting/formatting
- Add commit message linting (commitlint)
- Document deployment process in README
- Add health check endpoint (`/api/health`)
- Create database migration documentation
- Add troubleshooting guide for common errors
- Set up prettier config for consistent formatting across team

## Optional Future Enhancements

- Multi-vendor marketplace support (multiple sellers per platform)
- Subscription/recurring payment support
- Gift cards and store credit
- Product recommendations ML engine
- Advanced analytics dashboard (Google Analytics, Mixpanel integration)
- Mobile app (React Native)
- Social login (Google, Facebook via Clerk)
- Live chat support integration
- Inventory forecasting
- Loyalty/rewards program
- Affiliate marketing system
- Multi-language support (i18n)
- Accessibility audit and WCAG compliance
- SEO optimization (meta tags, structured data, sitemap)

---

# NEW CLIENT UPDATES - TASK LIST

## Category Updates

- Update category options to "Makeup", "Face Care", "Hair Care" in home page categories section (`app/page.tsx`)
- Update product filtering dropdown/UI on `/products` page to use new categories
- Update any category validation schemas (Zod) in product creation forms (`app/seller/products/`)
- Update database seed script if exists to use new categories
- Search and replace old category references across codebase

## Social Handles Section

- Add `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_TWITTER_URL` to `.env.local`
- Create `SocialLinks` component with icons for social platforms (`components/custom/SocialLinks.tsx`)
- Add social handles section to footer (`components/custom/Footer.tsx` or create if missing)
- Add social handles section to contact page (`app/contact/page.tsx`)

## WhatsApp Floating Icon

- Create `WhatsAppFloatingButton` component (`components/custom/WhatsAppFloatingButton.tsx`)
- Add WhatsApp icon (react-icons or lucide-react)
- Implement fixed positioning (bottom-right, z-index above content)
- Add click handler that generates WhatsApp URL with pre-filled message
- Create utility function to generate context-aware messages based on current route/page (`lib/whatsappMessages.ts`)
- Add message templates for:
  - Product page: include product name and URL
  - Cart page: mention cart inquiry
  - Checkout page: mention checkout assistance
  - Home/general: general inquiry message
- Add `NEXT_PUBLIC_WHATSAPP_NUMBER` to `.env.local`
- Add component to root layout (`app/layout.tsx`)

## Product Review Functionality (Client-Specific)

- Add Review model to Prisma schema (`prisma/schema.prisma`)
- Create `POST /api/products/[id]/reviews` route for submitting reviews
- Create `GET /api/products/[id]/reviews` route for fetching reviews
- Add review form component to product detail page (`components/custom/reviews/ReviewForm.tsx`)
- Add review list component (`components/custom/reviews/ReviewList.tsx`)
- Add star rating component (`components/custom/reviews/StarRating.tsx`)
- Add review submission logic with user authentication check
- Display average rating and review count on product cards
- Add reviews section to product detail page (`app/products/[id]/page.tsx`)

## Product Page Disclaimer

- Create `ProductDisclaimer` component (`components/custom/ProductDisclaimer.tsx`)
- Add disclaimer text content (decide if static or from database)
- Add disclaimer section to product detail page below description (`app/products/[id]/page.tsx`)
- Style disclaimer with appropriate typography (smaller text, muted color)

## Contact Page WhatsApp Redirect

- Remove existing contact form from contact page (`app/contact/page.tsx`)
- Add WhatsApp CTA button with pre-filled contact message
- Add supporting text explaining to contact via WhatsApp
- Update page title/description to reflect WhatsApp contact method
- Optionally keep basic contact info (email, phone, address) for display only

## Locate Store / Factory Page

- Create new route at `app/locate-store/page.tsx`
- Add store/factory address and contact details
- Integrate Google Maps embed or similar mapping solution
- Add store hours, directions, and any special instructions
- Create navigation link in header menu
- Create navigation link in footer
- Add store location data to config or environment variables
- Optionally add multiple locations if applicable
