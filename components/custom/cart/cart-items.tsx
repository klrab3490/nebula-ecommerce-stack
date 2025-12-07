"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import type { CartItem as CartItemType } from "@/contexts/AppContext";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, currency, cart } = useAppContext();
  const [showWarning, setShowWarning] = useState(false);

  // Check if this item is part of an applied bundle
  const isInAppliedBundle =
    cart.appliedBundles &&
    cart.appliedBundles.some((bundle) => bundle.requiredItems.includes(item.id));

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      if (isInAppliedBundle) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (isInAppliedBundle) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
    removeItem(item.id);
  };

  return (
    <Card className="p-4 relative">
      {showWarning && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 animate-fade-in-up">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            Removing this will cancel the bundle offer
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {item.image && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{item.name}</h3>
          {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
          <p className="text-sm font-medium text-foreground">
            {currency || "$"}
            {item.price.toFixed(2)}
          </p>
          {isInAppliedBundle && (
            <div className="flex items-center gap-1 mt-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Part of bundle offer
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-right">
          <p className="font-medium text-foreground">
            {currency || "$"}
            {(item.price * item.quantity).toFixed(2)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
