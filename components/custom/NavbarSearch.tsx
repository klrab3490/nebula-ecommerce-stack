"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

interface NavbarSearchProps {
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  maxResults?: number;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function NavbarSearch({
  placeholder = "Search products...",
  className = "",
  debounceMs = 300,
  maxResults = 8,
  onClose,
  isMobile = false,
}: NavbarSearchProps) {
  const { products } = useAppContext();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);
  // Filter products based on debounced query
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchTerm = debouncedQuery.toLowerCase().trim();
    return products
      .filter((product) => product.name.toLowerCase().includes(searchTerm))
      .slice(0, maxResults);
  }, [debouncedQuery, products, maxResults]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when filtered products change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredProducts]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    console.log(e.target.value);
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredProducts.length === 0) {
        if (e.key === "Escape") {
          setIsOpen(false);
          setQuery("");
          onClose?.();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < filteredProducts.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredProducts.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredProducts.length) {
            handleProductSelect(filteredProducts[highlightedIndex].id);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          setHighlightedIndex(-1);
          onClose?.();
          break;
      }
    },
    [isOpen, filteredProducts, highlightedIndex, onClose]
  );

  const handleProductSelect = useCallback(
    (productId: string) => {
      setQuery("");
      setIsOpen(false);
      setHighlightedIndex(-1);
      onClose?.();
      // Navigation is handled by the Link component
    },
    [onClose]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleFocus = useCallback(() => {
    if (query.trim()) {
      setIsOpen(true);
    }
  }, [query]);

  console.log("Rendered NavbarSearch with products:", products);
  const showDropdown = isOpen && debouncedQuery.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
            isMobile ? "h-5 w-5 left-4" : "h-4 w-4"
          }`}
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={
            isMobile
              ? "pl-12 pr-10 h-12 text-base bg-accent/50 border-border/50 focus:bg-background focus:border-border rounded-xl"
              : "pl-10 pr-10 w-64 h-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 rounded-full transition-all"
          }
          autoComplete="off"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className={`absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent ${
              isMobile ? "h-10 w-10" : "h-7 w-7"
            }`}
          >
            <X className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={`absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isMobile ? "left-0" : "min-w-80 right-0"
          }`}
        >
          {filteredProducts.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {filteredProducts.map((product, index) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    onClick={() => handleProductSelect(product.id)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      index === highlightedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    {product.images ? (
                      <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product.images[0]}
                          alt={product.alt || product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
            </div>
          )}

          {/* Search tip */}
          {filteredProducts.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">↑</kbd>{" "}
                <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">↓</kbd> to
                navigate,{" "}
                <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Enter</kbd> to
                select
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
