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

/*
  GET /api/user/address
  Returns all addresses for the logged-in user
*/
export async function GET() {
    try {
        const userId = await getPrismaUserId();

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: "desc" },
        });

        return NextResponse.json({ addresses });
    } catch (err) {
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

        const requiredFields = [
            "street",
            "city",
            "state",
            "zipCode",
            "country",
            "phone",
        ];

        for (const f of requiredFields) {
            if (!body[f]) {
                return NextResponse.json(
                    { error: `${f} is required` },
                    { status: 400 }
                );
            }
        }

        // How many addresses exist for this user?
        const existingCount = await prisma.address.count({ where: { userId } });

        const newAddress = await prisma.address.create({
            data: {
                userId,
                street: body.street,
                city: body.city,
                state: body.state,
                zipCode: body.zipCode,
                country: body.country,
                phone: body.phone,
                // Mark as default if it's the user's first address
                isDefault: existingCount === 0,
            },
        });

        return NextResponse.json({ success: true, address: newAddress });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

/*
  PUT /api/user/address
  Update address fields or set default
*/
export async function PUT(req: Request) {
    try {
        const userId = await getPrismaUserId();
        const { id, ...updateData } = await req.json();

        if (!id)
            return NextResponse.json({ error: "Address id required" }, { status: 400 });

        // Ensure the address belongs to the user
        const existing = await prisma.address.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        // If the user is setting this as default, remove default from others
        if (updateData.isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        const updated = await prisma.address.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, address: updated });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

/*
  DELETE /api/user/address?id=123
*/
export async function DELETE(req: Request) {
    try {
        const userId = await getPrismaUserId();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id)
            return NextResponse.json({ error: "Address id required" }, { status: 400 });

        // Ensure the address belongs to the user
        const existing = await prisma.address.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.address.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
