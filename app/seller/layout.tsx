import React from "react";
import type { User } from "@clerk/backend";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import SellerSideBarClient from "@/components/custom/seller/SellerSideBarClient";

type PublicMetadata = Record<string, unknown>;

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
    // Server-side check: ensure user is authenticated and has seller (or admin) role
    const user = await currentUser();
    if (!user) {
        // Not signed in -> send to home (signin is handled via Clerk in the navbar)
        redirect("/");
    }

    // publicMetadata typed as unknown -> narrow to our shape
    const publicMetadata = (user as User | null)?.publicMetadata as PublicMetadata | undefined;
    const role = publicMetadata?.role as string | undefined;

    if (!(role === "seller" || role === "admin")) {
        // Signed in but not authorized as a seller -> redirect to home
        redirect("/");
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar is a client component for interactive navigation */}
            <SellerSideBarClient />
            <main className="flex-1 p-6 overflow-y-scroll">{children}</main>
        </div>
    );
}
