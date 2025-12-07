"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReviewForm from "@/components/custom/reviews/ReviewForm";
import ReviewList from "@/components/custom/reviews/ReviewList";
import ProductDisclaimer from "@/components/custom/ProductDisclaimer";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  alt?: string;
  description: string;
  features: string[];
  specifications?: {
    quantity?: string;
    ingredients?: string;
    howToUse?: string;
    benefits?: string;
    [key: string]: string | undefined;
  };
  faq: { question: string; answer: string }[];
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const { addItem, cart, updateQuantity, removeItem } = useAppContext();

  // Slider refs/state
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load product");
          setProduct(null);
          return;
        }

        const p = data.product;

        // Map DB product shape to UI shape (with fallbacks)
        const mapped: Product = {
          id: p.id,
          name: p.name,
          // If discountedPrice exists and >0, show it as price and originalPrice as price
          price: p.discountedPrice && p.discountedPrice > 0 ? p.discountedPrice : p.price,
          originalPrice: p.discountedPrice && p.discountedPrice > 0 ? p.price : undefined,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ["/placeholder.svg"],
          alt: p.name,
          description: p.description || "",
          features: Array.isArray(p.features) ? p.features : [],
          specifications: p.specifications || {},
          faq: Array.isArray(p.faq) ? p.faq : [],
        };

        setProduct(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/30 border-t-transparent animate-spin-slow" />
          </div>
          <span className="text-lg font-medium text-muted-foreground animate-pulse">
            Loading product...
          </span>
        </div>
        <style jsx>{`
          @keyframes spin-slow {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 2s linear infinite;
          }
        `}</style>
      </div>
    );
  if (error) return <div className="py-12 text-center text-red-600">{error}</div>;
  if (!product) return <div className="py-12 text-center">Product not found</div>;
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  // No autoplay - manual navigation only

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    touchDeltaX.current = delta;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(calc(${-currentImageIndex * 100}% + ${delta}px))`;
    }
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null) return;
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transition = "";
      trackRef.current.style.transform = "";
    }
    if (Math.abs(delta) > 50) {
      if (delta < 0) nextImage();
      else prevImage();
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const cartItem = product ? cart.items.find((item) => item.id === product.id) : undefined;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden p-0">
              <CardContent className="p-0 relative">
                <div
                  className="relative w-full h-[600px] overflow-hidden"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div
                    ref={trackRef}
                    className="flex h-[600px] transition-transform duration-300"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {product.images.map((image, idx) => (
                      <div
                        key={idx}
                        className="min-w-full h-full relative flex items-center justify-center bg-white"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} view ${idx + 1}`}
                          width={1000}
                          height={1000}
                          className="object-contain w-full h-full rounded-lg"
                        />
                      </div>
                    ))}
                  </div>

                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {product.images.length > 1 && (
              <div className="flex gap-2 mt-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${currentImageIndex === index ? "border-primary" : "border-border"}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <Badge variant="destructive">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              {cartItem ? (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 bg-transparent border-2 border-primary hover:bg-primary/10"
                      onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                    >
                      <Minus className="h-4 w-4 text-primary" />
                    </Button>

                    <div className="flex-1 text-center py-2 px-2 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="text-lg font-bold text-primary">{cartItem.quantity}</span>
                    </div>

                    <Button
                      size="icon"
                      className="h-12 w-12 bg-primary hover:bg-primary/90 text-white border-0 rounded-lg shadow-lg group/add"
                      onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover/add:scale-110" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
              <Button
                variant={isWishlisted ? "default" : "outline"}
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Product Specifications</h3>

                {product.specifications.quantity && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400">📦</span>
                        Quantity
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {product.specifications.quantity}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {product.specifications.ingredients && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">🌿</span>
                        Ingredients
                      </h4>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {product.specifications.ingredients}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {product.specifications.howToUse && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">📝</span>
                        How to Use
                      </h4>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {product.specifications.howToUse}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {product.specifications.benefits && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-pink-600 dark:text-pink-400">✨</span>
                        Benefits
                      </h4>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {product.specifications.benefits}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Other custom specifications */}
                {Object.entries(product.specifications)
                  .filter(
                    ([key]) => !["quantity", "ingredients", "howToUse", "benefits"].includes(key)
                  )
                  .map(
                    ([key, value]) =>
                      value && (
                        <Card key={key}>
                          <CardContent className="p-6">
                            <h4 className="font-semibold mb-2 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <p className="text-muted-foreground text-sm whitespace-pre-line">
                              {value}
                            </p>
                          </CardContent>
                        </Card>
                      )
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <ProductDisclaimer />
        </div>

        {/* FAQ Section */}
        {product.faq && product.faq.length > 0 && (
          <div className="mt-12 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="max-w-7xl w-full">
              {product.faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Customer Reviews
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Review Form */}
            <div>
              <ReviewForm
                productId={product.id}
                onReviewSubmitted={() => setReviewRefreshTrigger((prev) => prev + 1)}
              />
            </div>

            {/* Review List */}
            <div>
              <ReviewList productId={product.id} refreshTrigger={reviewRefreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
