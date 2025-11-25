"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// [NOTE: Assume getPrismaUserId and utility functions are imported or defined elsewhere]
// ... (Your getPrismaUserId function should be copied/imported here)

// Resolve Clerk session user to our Prisma User id.
// If a corresponding User record doesn't exist, create it.
async function getPrismaUserId() {
  const clerkUser = await currentUser();
  const clerkId = clerkUser?.id;
  if (!clerkId) throw new Error("Unauthorized");

  // Try to find the local user by clerkId
  let dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) {
    // ... (Logic to create user if not found)
    const email =
      (clerkUser as any)?.primaryEmailAddress?.emailAddress ||
      (clerkUser as any)?.emailAddresses?.[0]?.emailAddress ||
      "";
    const name = (clerkUser as any)?.fullName || (clerkUser as any)?.firstName || "User";

    dbUser = await prisma.user.create({
      data: {
        clerkId,
        email: email || `${clerkId}@clerk.local`,
        name,
        role: "buyer",
      },
    });
  }

  return dbUser.id;
}

function sanitizeString(v: unknown) {
  if (v === undefined || v === null) return undefined;
  return String(v).trim();
}

function validateAddressPayload(body: any, requireAll = false) {
  const allowed = ["name", "street", "city", "state", "zipCode", "country", "phone", "isDefault"];
  const errors: string[] = [];
  const out: Record<string, any> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === "isDefault") {
        out.isDefault = Boolean(body.isDefault);
      } else {
        out[key] = sanitizeString(body[key]) ?? "";
      }
    }
  }

  if (requireAll) {
    const required = ["name", "street", "city", "state", "zipCode", "country", "phone"];
    for (const r of required) {
      if (!out[r]) errors.push(`${r} is required`);
    }
  }

  // Basic length checks
  if (out.phone && out.phone.length < 6) errors.push("phone is too short");
  if (out.zipCode && out.zipCode.length < 3) errors.push("zipCode is too short");

  return { valid: errors.length === 0, errors, payload: out };
}

/*
  GET /api/user/address/[address_id]
  Returns a single address for the logged-in user
*/
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Get address_id from URL
) {
  try {
    const userId = await getPrismaUserId();
    const resolvedParams = await params;
    const addressId = resolvedParams.id;

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: userId, // CRITICAL: Ensure the address belongs to the logged-in user
      },
    });

    if (!address) {
      // Return 404 if the address is not found OR if it doesn't belong to the user
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(address);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Get address_id from URL
) {
  try {
    const userId = await getPrismaUserId();
    const resolvedParams = await params;
    const addressId = resolvedParams.id;
    const payload = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Ensure the address belongs to the user
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    // Validate payload (basic example, expand as needed)
    const { valid, errors } = validateAddressPayload(payload);
    if (!valid) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }
    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        name: payload.name,
        street: payload.street,
        city: payload.city,
        state: payload.state,
        zipCode: payload.zipCode,
        country: payload.country,
        phone: payload.phone,
        isDefault: payload.isDefault,
      } as any,
    });
    return NextResponse.json({ success: true, address: updatedAddress });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Get address_id from URL
) {
  try {
    const userId = await getPrismaUserId();
    const resolvedParams = await params;
    const addressId = resolvedParams.id;
    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Ensure the address belongs to the user
    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id: addressId } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
