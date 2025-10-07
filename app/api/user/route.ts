"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, role } = await req.json();
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
    return NextResponse.json(
      { success: false, error: error?.toString() },
      { status: 500 }
    );
  }
}
