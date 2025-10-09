# 🌌 Nebula E‑Commerce Stack

A modern full‑stack e‑commerce starter built with the Next.js App Router and ready for production use-cases.

This repository is an opinionated starter that wires authentication, a database schema, admin/seller pages, and UI components so you can iterate quickly.

## Key technologies

- Next.js (App Router) — React framework for server rendering and edge-ready routes
- Clerk — Authentication and user management (via `@clerk/nextjs`)
- Prisma — Typesafe database client (configured to use MongoDB in `prisma/schema.prisma`)
- MongoDB — Database (Prisma datasource uses the MongoDB provider)
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

Create a `.env` or `.env.local` file at the repo root with at least the following values:

```
# Prisma / MongoDB
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Optional / app-specific
NEXT_PUBLIC_CURRENCY=USD
```

Adjust values to match your environment. The Prisma client is configured to use `DATABASE_URL` (see `prisma/schema.prisma`).

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

## Notes & recommendations

- The project includes `@prisma/client` and a `prisma` generator; keep `postinstall` to ensure the client is generated after `npm install`.
- `mongoose` appears in `package.json` but is not used by the application code. Remove it to reduce install size if you don't need it.
- In production, provide a managed MongoDB connection string and secure your Clerk keys.
- Consider adding a `.env.example` file listing required env keys (safe to commit without secrets).

---

## Example: creating a Clerk-synced user (server API)

The app contains an API route (`/app/api/user/route.ts`) which demonstrates syncing Clerk users into the Prisma `User` model. See the route for implementation details.

---

## Contributing

Contributions are welcome. If you'd like to add features, open an issue or a PR with a short description of the change.

---

## License

MIT — feel free to use and modify for your projects.
