import React from 'react';
import SellerSideBar from '@/components/custom/SellerSideBar';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SellerSideBar />
      <main className="flex-1 p-6 overflow-y-scroll">
        {children}
      </main>
    </div>
  );
}
