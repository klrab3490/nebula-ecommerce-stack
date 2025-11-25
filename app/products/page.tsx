import { Suspense } from "react";
import ProductsClient from "@/components/custom/ProductsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
