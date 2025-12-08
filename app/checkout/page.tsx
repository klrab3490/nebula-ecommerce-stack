"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Wallet, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useCallback, useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PaymentMethod = "upi" | "cod";

export default function CheckoutPage() {
  const [finalTotal, setFinalTotal] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const v = localStorage.getItem("finalTotal");
    return v ? parseFloat(v) : 0;
  });

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<any>(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const { userData, cart, clearCart } = useAppContext();
  const [processingOrder, setProcessingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem("finalTotal");
    setFinalTotal(v ? parseFloat(v) : 0);

    // Mark cart as loaded after a brief delay to allow context to initialize
    const timer = setTimeout(() => setCartLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only check cart after it's loaded to avoid race condition
    if (!cartLoaded) return;

    if (cart.itemCount === 0) {
      router.push("/cart");
    }
  }, [cart.itemCount, cartLoaded, router]);

  const isAddressPresent = (addr: any) => {
    if (!addr) return false;
    if (Array.isArray(addr)) return addr.length > 0;
    if (typeof addr === "string") return addr.trim().length > 0;
    if (typeof addr === "object") {
      if (Object.keys(addr).length === 0) return false;
      return Boolean(addr.line1 || addr.street || addr.addressLine || addr.city || addr.postalCode);
    }
    return false;
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/address", { cache: "no-store" });
        if (!res.ok) {
          console.warn("Failed to load addresses", res.status);
          setAddress(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const addresses: any[] = data?.addresses ?? [];
        setAddresses(addresses);

        const chosen = addresses.find((a) => a?.isDefault) || addresses[0] || null;
        setAddress(chosen);
        setSelectedAddressId(chosen?.id ?? addresses[0]?.id ?? null);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setAddress(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCashOnDelivery = async () => {
    if (!cart || cart.finalTotal <= 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!isAddressPresent(address)) {
      alert("Please add your address before placing order.");
      router.push("/account/address/add");
      return;
    }

    setProcessingOrder(true);

    try {
      // Debug: Log cart data before sending
      // console.log("Cart data being sent:", { items: cart.items, total: cart.finalTotal, itemCount: cart.itemCount, });

      // Create order directly with COD status
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: {
            items: cart.items,
            total: cart.finalTotal, // Use cart.finalTotal (subtotal after bundles) not finalTotal (with shipping/tax)
            itemCount: cart.itemCount,
          },
          userId: userData ? userData.id : null, // TODO: replace with actual user ID from your auth provider (e.g. Clerk)
          paymentMethod: "cod",
          addressId: selectedAddressId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }

      const data = await res.json();

      // Clear cart and redirect to success
      clearCart();
      localStorage.removeItem("finalTotal");
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      console.error("COD Order Error:", err);
      alert(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleUPIPayment = useCallback(async () => {
    if (!cart || cart.finalTotal <= 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!isAddressPresent(address)) {
      alert("Please add your address before making payment.");
      router.push("/account/address/add");
      return;
    }

    setProcessingOrder(true);

    try {
      // Step 1: Create order in database first
      const createOrderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: {
            items: cart.items,
            total: cart.finalTotal, // Use cart.finalTotal (subtotal after bundles) not finalTotal (with shipping/tax)
            itemCount: cart.itemCount,
          },
          paymentMethod: "upi",
          addressId: selectedAddressId,
        }),
      });

      if (!createOrderRes.ok) {
        const data = await createOrderRes.json();
        throw new Error(data.error || "Failed to create order");
      }

      const orderData = await createOrderRes.json();
      const dbOrderId = orderData.orderId; // Save this to pass to verify endpoint

      // Step 2: Create Razorpay order
      const res = await fetch("/api/checkout/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round((finalTotal ?? 0) * 100),
          currency: "INR",
          orderID: dbOrderId, // Use our database orderId
        }),
      });

      if (!res.ok) {
        alert("Failed to initialize payment");
        setProcessingOrder(false);
        return;
      }

      const data = await res.json();
      const razorpayOrderId = data.orderId; // Razorpay's order_id

      // Step 3: Update our database order with Razorpay order ID
      await fetch("/api/checkout/update-razorpay-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: dbOrderId,
          razorpayOrderId: razorpayOrderId,
        }),
      });

      // Load Razorpay script
      const loadScript = (src: string) =>
        new Promise<boolean>((resolve) => {
          if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
          const s = document.createElement("script");
          s.src = src;
          s.async = true;
          s.onload = () => resolve(true);
          s.onerror = () => resolve(false);
          document.body.appendChild(s);
        });

      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok) {
        alert("Failed to load Razorpay SDK");
        setProcessingOrder(false);
        return;
      }

      const options = {
        key: data.key || process.env.RAZORPAY_KEY_ID || "",
        amount: data.amount,
        currency: data.currency,
        name: "Nebula Shop",
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verify = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderId: dbOrderId, // Pass our database orderId
                cart: {
                  items: cart.items,
                  total: cart.finalTotal, // Use cart.finalTotal (subtotal after bundles) not finalTotal (with shipping/tax)
                  itemCount: cart.itemCount,
                },
                addressId: selectedAddressId,
              }),
            });

            if (verify.ok) {
              clearCart();
              localStorage.removeItem("finalTotal");
              const verifyData = await verify.json();
              router.push(`/checkout/success?orderId=${verifyData.orderId}`);
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingOrder(false);
          },
        },
      };

      const RazorpayClass = (window as any).Razorpay;
      if (!RazorpayClass) {
        alert("Razorpay SDK not available");
        setProcessingOrder(false);
        return;
      }

      const rz = new RazorpayClass(options);
      rz.on &&
        rz.on("payment.failed", (err: any) => {
          console.error("payment.failed", err);
          alert("Payment failed: " + (err?.error?.description || "Unknown"));
          setProcessingOrder(false);
        });
      rz.open();
    } catch (err) {
      console.error(err);
      setProcessingOrder(false);
    }
  }, [cart, address, router, finalTotal, selectedAddressId, clearCart]);

  const handlePayment = () => {
    if (paymentMethod === "cod") {
      handleCashOnDelivery();
    } else {
      handleUPIPayment();
    }
  };

  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Checking address…</p>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Checkout</h1>

      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Items:</span>
                <span>{cart.itemCount}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-gray-100">
                <span>Total:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                <select
                  value={selectedAddressId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value || null;
                    setSelectedAddressId(id);
                    const sel = addresses.find((a) => a.id === id) || null;
                    setAddress(sel);
                  }}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} - {a.street}, {a.city}
                    </option>
                  ))}
                </select>

                {address && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{address.name}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{address.street}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {address.country} • {address.phone}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => router.push("/account/address/add")}>
                    Add New Address
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/account/address")}>
                    Manage Addresses
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-red-600 dark:text-red-400 mb-2">No address added.</p>
                <Button onClick={() => router.push("/account/address/add")}>Add Address</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Choose how you want to pay for your order</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            >
              <div className="space-y-3">
                {/* UPI Payment Option */}
                <Label
                  htmlFor="upi"
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="upi" id="upi" />
                  <div className="flex items-center flex-1 gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Prepaid Delivery
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pay securely using UPI, Cards, Net Banking
                      </p>
                    </div>
                  </div>
                </Label>

                {/* Cash on Delivery Option */}
                <Label
                  htmlFor="cod"
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="flex items-center flex-1 gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pay with cash when your order arrives
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <Button
          className="w-full h-12 text-lg"
          onClick={handlePayment}
          disabled={processingOrder || !address}
        >
          {processingOrder ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : paymentMethod === "cod" ? (
            `Place Order - Cash on Delivery (₹${finalTotal.toFixed(2)})`
          ) : (
            `Proceed to Payment (₹${finalTotal.toFixed(2)})`
          )}
        </Button>
      </div>
    </div>
  );
}
