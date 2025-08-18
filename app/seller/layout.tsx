import React from 'react';
import SellerSideBar from '@/components/custom/SellerSideBar';

export default function SellerProducts() {
  return (
    <div className='flex h-full'>
      <SellerSideBar />
      <div className='flex-1'>
        <h1>Seller Products</h1>
      </div>
    </div>
  )
}