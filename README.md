# 🌌 Nebula E-Commerce Stack

An **event-driven full-stack e-commerce starter** built with:

- [Next.js](https://nextjs.org/) — React framework for server-side rendering and modern web apps  
- [Clerk](https://clerk.com/) — Authentication and user management  
- [MongoDB](https://www.mongodb.com/) — NoSQL database for product, user, and order data  
- [Inngest](https://www.inngest.com/) — Event-driven background jobs and workflows  

---

## 🚀 Features

- 🔑 Secure authentication with **Clerk** (sign-in, sign-up, sessions, profiles)  
- 🛍️ Product and order management with **MongoDB**  
- ⚡ Background jobs and workflows with **Inngest** (e.g., order confirmations, scheduled tasks)  
- 🖼️ Ready-to-use **Next.js App Router** project structure  
- 🎨 Easily extendable with TailwindCSS and shadcn/ui  

---

## 📂 Project Structure

```

nebula-ecommerce-stack/
├── app/                # Next.js app router pages
├── components/         # Reusable UI components
├── lib/                # DB client, Clerk, Inngest configs
├── inngest/            # Inngest functions (background jobs)
├── public/             # Static assets
├── styles/             # Global styles (Tailwind)
└── README.md

````

---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/klrab3490/nebula-ecommerce-stack.git
cd nebula-ecommerce-stack
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup environment variables

Create a `.env.local` file with the following:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

# MongoDB
MONGODB_URI=your_mongodb_uri

# Inngest
INNGEST_EVENT_KEY=your_key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

App will be running at [http://localhost:3000](http://localhost:3000) 🚀

---

## ⚡ Example Inngest Function

```ts
import { inngest } from "@/inngest/client";
import { db } from "@/lib/mongodb";

export const createUserFn = inngest.createFunction(
  { id: "create-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const user = event.data;
    await db.collection("users").insertOne({
      clerkId: user.id,
      email: user.email_addresses[0].email_address,
      createdAt: new Date(),
    });

    // Add background actions here (send email, etc.)
  }
);
```

---

## 🌌 Logo

<p align="center">
  <img src="./logo.png" alt="Nebula E-commerce Stack Logo" width="300"/>
</p>

---

## 📜 License

MIT — feel free to use and modify for your projects.
Built with ❤️ using Next.js, Clerk, MongoDB, and Inngest.
