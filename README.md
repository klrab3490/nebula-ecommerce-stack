# 🌌 Nebula E‑Commerce Stack

A modern full‑stack e‑commerce starter built with the Next.js App Router and ready for production use-cases.

This repository is an opinionated starter that wires authentication, a database schema, admin/seller pages, and UI components so you can iterate quickly.

## Key technologies

- Next.js (App Router) — React framework for server rendering and edge-ready routes
- Clerk — Authentication and user management (via `@clerk/nextjs`)
- Prisma — Typesafe database client (configured to use MongoDB in `prisma/schema.prisma`)
- MongoDB — Database (Prisma datasource uses the MongoDB provider)
- UploadThing — File upload service for handling product images and media
- TailwindCSS — Utility-first styling (configured in the project)
- TypeScript — Static typing

Note: `mongoose` is listed in `package.json` but the application code uses Prisma + MongoDB (see `prisma/schema.prisma` and `lib/prisma.ts`). You can remove the unused dependency if you don't need it.

---

## Project structure (important folders)

- `app/` — Next.js App Router routes and pages (UI and server actions)
- `components/` — Reusable UI components (site, cart, seller dashboard, etc.)
- `lib/` — Helpers and clients (e.g. `lib/prisma.ts`)
- `contexts/` — React contexts used across the app
- `prisma/` — Prisma schema and seeds
- `public/` — Static assets (images, logos)

---

## Getting started (local development)

1. Clone the repo

   git clone https://github.com/klrab3490/nebula-ecommerce-stack.git
   cd nebula-ecommerce-stack

2. Install dependencies

   npm install

   Note: `prisma generate` runs automatically after install because of the `postinstall` script.

3. Create environment variables

Create a `.env.local` file at the repo root with the following values:

```bash
# Public Environment Variables
NEXT_PUBLIC_CURRENCY=INR

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database (MongoDB)
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority&appName=<appName>"

# UploadThing (File uploads)
UPLOADTHING_TOKEN=your_uploadthing_token

# Razorpay (Payment processing) - Optional, required only for checkout functionality
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

You can also copy from `.env.example` and fill in your values. The Prisma client is configured to use `DATABASE_URL` (see `prisma/schema.prisma`).

4. Run the dev server

   npm run dev

Open http://localhost:3000 to view the app.

---

## Useful scripts

- `npm run dev` — Start Next.js in development
- `npm run build` — Run `prisma generate` then build the Next.js app
- `npm run start` — Start the production server (after build)
- `npm run lint` — Run ESLint

---

## Database

This project uses Prisma with the MongoDB provider. The schema is at `prisma/schema.prisma` and models include `User`, `Product`, `Order`, `FAQ`, and relation tables used for many-to-many patterns.

To regenerate Prisma client after you change the schema:

   npx prisma generate

To apply Prisma schema changes when using MongoDB in development, manage your data carefully — Prisma's migrations flow for relational databases differs from MongoDB workflows.

---

## Authentication

Clerk is integrated with `@clerk/nextjs`. Provider wiring is in `app/layout.tsx` and components use hooks like `useUser` and `UserButton`.

Set your Clerk keys in the environment and follow Clerk docs to create an application for local development.

---

## File Uploads

UploadThing is integrated for handling file uploads (primarily for product images). The integration includes:

- File upload API routes at `/api/uploadthing`
- Upload components in `utils/uploadthing.ts` (`UploadButton`, `UploadDropzone`)
- Configuration supports image uploads up to 4MB

To use UploadThing:
1. Create an account at [uploadthing.com](https://uploadthing.com)
2. Get your token and add it to `UPLOADTHING_TOKEN` in your environment variables
3. Use the `UploadButton` or `UploadDropzone` components in your React components

---

## Notes & recommendations

- The project includes `@prisma/client` and a `prisma` generator; keep `postinstall` to ensure the client is generated after `npm install`.
- `mongoose` appears in `package.json` but is not used by the application code. Remove it to reduce install size if you don't need it.
- In production, provide a managed MongoDB connection string and secure your Clerk keys.
- Consider adding a `.env.example` file listing required env keys (safe to commit without secrets).

---

## Example: creating a Clerk-synced user (server API)

The app contains an API route (`/app/api/user/route.ts`) which demonstrates syncing Clerk users into the Prisma `User` model. See the route for implementation details.

---

## Checkout & Payment Integration (Razorpay + Shiprocket)

This project includes a basic checkout flow wired to Razorpay for payments and a placeholder for Shiprocket shipment creation. The implementation is minimal and intended as a starting point — replace the Shiprocket stub with real API calls and add any missing validation/auth as needed.

### Required environment variables for checkout

Add these to your `.env.local` file at the project root (in addition to the basic environment variables):

- `RAZORPAY_KEY_ID` — Razorpay API Key ID
- `RAZORPAY_KEY_SECRET` — Razorpay API Key Secret
- (optional) `SHIPROCKET_EMAIL` — Shiprocket account email (if you implement Shiprocket token flow)
- (optional) `SHIPROCKET_PASSWORD` — Shiprocket password (if you implement Shiprocket token flow)

These are already included in the main environment variables section above, but are essential for the payment functionality to work.

### Endpoints added in this repo

- `POST /api/checkout/create-order`
   - Body: `{ cart, userId? }`
   - Creates an Order in the database (`status: pending`) and returns `{ orderId, shipment? }`
- `POST /api/checkout/razorpay/create-order`
   - No body expected (current implementation finds the first pending order)
   - Creates a Razorpay order (server-side) and returns `{ key, orderId, amount, currency }`
- `POST /api/checkout/razorpay/verify`
   - Body: `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`
   - Verifies the signature and marks the order as paid

### Frontend pages

- `/checkout` — checkout landing page (calls create-order)
- `/checkout/payment` — client opens Razorpay checkout (calls create-order → razorpay/create-order → opens popup)
- `/checkout/success` — success page shown after verification

### Testing the flow locally

1. Start the dev server:
   ```cmd
   npm run dev
   ```
2. Add items to the cart in the UI and click "Proceed to Checkout".
3. Complete payment through the Razorpay popup (in test mode use Razorpay test cards or UPI test flows).
4. After payment completes, the client posts to `/api/checkout/razorpay/verify` which updates order status to `paid`.

### Notes, caveats and next steps

- Shiprocket integration in `lib/shiprocket.ts` is a placeholder that returns a fake shipment id. To use Shiprocket:
   - Implement authentication (token exchange) with Shiprocket API and call the create shipment endpoint.
   - Extend `prisma/schema.prisma` to store shipment/tracking on the `Order` model and run prisma migrations.
- Current Razorpay endpoints assume a single pending order (they use `findFirst({ status: 'pending' })`). For production use:
   - Create the order explicitly and pass the `orderId` to the Razorpay create-order endpoint to avoid race conditions and to handle multiple concurrent users.
   - Add server-side validation of cart items, prices and stock before creating orders.
- Add webhooks for Razorpay to handle asynchronous events (captures, refunds). This repo does not yet implement webhooks.

If you want, I can next:
- Implement a full Shiprocket integration and update the Prisma schema + migrations.
- Improve the Razorpay flow to accept an explicit `orderId` and add webhooks.
- Wire orders to authenticated users using Clerk (installed in this repo).

Tell me which of the above you'd like me to implement next and I will proceed.


## Contributing

Contributions are welcome. If you'd like to add features, open an issue or a PR with a short description of the change.

---

## License

MIT — feel free to use and modify for your projects.
