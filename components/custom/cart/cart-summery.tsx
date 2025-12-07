"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

export function CartSummary() {
  const { cart, clearCart, currency } = useAppContext();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { total, itemCount, bundleSavings, finalTotal: cartFinalTotal } = cart;

  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = cartFinalTotal + shipping + tax;
  localStorage.setItem("finalTotal", finalTotal.toString());

  // console.log("Final Total in CartSummary:", finalTotal);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({itemCount} items)</span>
          <span>
            {currency || "$"}
            {total.toFixed(2)}
          </span>
        </div>

        {bundleSavings > 0 && (
          <div className="flex justify-between text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded-md border border-green-200 dark:border-green-800">
            <span className="text-green-700 dark:text-green-300 font-medium">Bundle Savings</span>
            <span className="text-green-700 dark:text-green-300 font-bold">
              -{currency || "$"}
              {bundleSavings.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `${currency || "$"}${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>
            {currency || "$"}
            {tax.toFixed(2)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>
            {currency || "$"}
            {finalTotal.toFixed(2)}
          </span>
        </div>

        {total < 50 && (
          <p className="text-xs text-muted-foreground">
            Add {currency || "$"}
            {(50 - total).toFixed(2)} more for free shipping
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {!user ? (
          <>
            <Button
              className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 rounded-xl py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              onClick={() => openSignIn()}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign in to Checkout
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You need to be signed in to proceed with checkout
            </p>
          </>
        ) : (
          <Button className="w-full" size="lg" disabled={itemCount === 0} asChild>
            <a href="/checkout">Proceed to Checkout</a>
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={clearCart}
          disabled={itemCount === 0}
        >
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
