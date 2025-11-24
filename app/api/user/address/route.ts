"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Resolve Clerk session user to our Prisma User id.
// If a corresponding User record doesn't exist, create it.
async function getPrismaUserId() {
    const clerkUser = await currentUser();
    const clerkId = clerkUser?.id;
    if (!clerkId) throw new Error("Unauthorized");

    // Try to find the local user by clerkId
    let dbUser = await prisma.user.findUnique({ where: { clerkId } });
    if (!dbUser) {
        // Create a local user record if one doesn't exist yet
        const email =
            // prefer primaryEmailAddress shape
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
  GET /api/user/address
  Returns all addresses for the logged-in user
*/
export async function GET(req: Request) {
    try {
        const userId = await getPrismaUserId();

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: "desc" },
        });

        return NextResponse.json({ addresses });
    } catch (err: any) {
        if (err?.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

/*
  POST /api/user/address
  Creates a new address for the logged-in user
*/
export async function POST(req: Request) {
    try {
        const userId = await getPrismaUserId();
        const body = await req.json();

        const { valid, errors, payload } = validateAddressPayload(body, true);
        if (!valid) {
            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        // How many addresses exist for this user?
        const existingCount = await prisma.address.count({ where: { userId } });

        const newAddress = await prisma.address.create({
            data: {
                userId,
                name: payload.name,
                street: payload.street,
                city: payload.city,
                state: payload.state,
                zipCode: payload.zipCode,
                country: payload.country,
                phone: payload.phone,
                // Mark as default if it's the user's first address
                isDefault: payload.isDefault ?? existingCount === 0,
            } as any,
        });

        return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
    } catch (err: any) {
        if (err?.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
