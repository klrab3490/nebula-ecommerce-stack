"use server";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateSessionMatchesUserId } from "@/lib/authSeller";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, role } = await req.json();
    // Ensure request is coming from an authenticated Clerk session
    const authCheck = await requireAuth(undefined);
    if (authCheck instanceof NextResponse) return authCheck;

    // Ensure the session user matches the clerk id being synced
    const sessionValid = await validateSessionMatchesUserId(id);
    if (!sessionValid) {
      return NextResponse.json({ success: false, error: "Session mismatch" }, { status: 401 });
    }
    // Check if user exists
    const existing = await prisma.user.findMany({
      where: { name },
    });
    if (!existing || existing.length === 0) {
      await prisma.user.create({
        data: {
          name,
          email,
          role,
          clerkId: id,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error syncing user:", error);
    return NextResponse.json({ success: false, error: error?.toString() }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("API error fetching users:", error);
    return NextResponse.json({ success: false, error: error?.toString() }, { status: 500 });
  }
}
