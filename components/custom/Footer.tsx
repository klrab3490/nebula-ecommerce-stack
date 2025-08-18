"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/seller") {
        // Do something if not on seller page
        return null;
    }

    return (
        <div>Footer</div>
    )
}