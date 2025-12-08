"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle, Package, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data.order);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch order:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-linear-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-3xl mx-auto py-12 px-4 relative z-10">
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 mx-auto">
              <div className="absolute -inset-2 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-green-100 dark:bg-green-900/30 rounded-full p-5">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-black mb-4 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Order Placed Successfully!
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading order details...</p>
              </div>
            ) : orderId ? (
              <>
                {/* Order Information */}
                <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold">Order Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono font-semibold">{orderId}</span>
                    </div>
                    {orderDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-semibold">₹{orderDetails.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-semibold capitalize">
                            {orderDetails.status === "paid" ? "Paid" : "Confirmed"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold mb-3">What happens next?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                      <span className="text-muted-foreground">
                        You'll receive a confirmation email shortly
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                      <span className="text-muted-foreground">
                        We'll notify you when your order is shipped
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                      <span className="text-muted-foreground">
                        Track your order status in "My Orders"
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Your order has been placed successfully!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push("/my-orders")}
                className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Package className="mr-2 h-4 w-4" />
                View My Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1 border-2"
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
