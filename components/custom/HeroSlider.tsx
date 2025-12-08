"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideData {
  id: number;
  type: "product" | "image-only";
  backgroundImage?: string;
  productImage?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    type: "image-only",
    backgroundImage: "/Banner.jpg",
  },
  {
    id: 2,
    type: "image-only",
    backgroundImage: "/Dandruf Oil.jpg",
  },
  {
    id: 3,
    type: "image-only",
    backgroundImage: "/Eye Brow.jpg",
  },
  {
    id: 4,
    type: "image-only",
    backgroundImage: "/Face Pack.jpg",
  },
  {
    id: 5,
    type: "image-only",
    backgroundImage: "/Henna.jpg",
  },
  {
    id: 6,
    type: "image-only",
    backgroundImage: "/Lip Balm.jpg",
  },
  {
    id: 7,
    type: "image-only",
    backgroundImage: "/Neelamri.jpg",
  },
  {
    id: 8,
    type: "image-only",
    backgroundImage: "/Organic Gel.jpg",
  },
  {
    id: 9,
    type: "image-only",
    backgroundImage: "/Rose mary oil.jpg",
  },
  {
    id: 10,
    type: "image-only",
    backgroundImage: "/Saffron Gel.jpg",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-fit overflow-hidden rounded-b-3xl shadow-2xl">
      {/* Enhanced Modern Overlay Gradient - Warmer tones */}
      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10 z-10 pointer-events-none"></div>

      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            {slide.type === "image-only" ? (
              // Image Only Slide - No text overlay
              <div className="relative w-full h-full">
                <Image
                  src={slide.backgroundImage || "/placeholder.svg"}
                  alt="Hero image"
                  width={2667}
                  height={350}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // Product Slide
              <div className="w-full h-full bg-linear-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center">
                <div className="container mx-auto px-6">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Product Image */}
                    <div className="flex justify-center">
                      <Image
                        src={slide.productImage || "/placeholder.svg"}
                        alt={slide.title || "Product image"}
                        className="object-contain drop-shadow-2xl animate-float"
                        width={400}
                        height={400}
                      />
                    </div>

                    {/* Product Content */}
                    <div className="text-center md:text-left">
                      {slide.title && (
                        <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient-primary animate-fade-in-up">
                          {slide.title}
                        </h1>
                      )}
                      {slide.subtitle && (
                        <p
                          className="text-xl md:text-2xl mb-6 text-gray-700 dark:text-gray-200 font-semibold animate-fade-in-up"
                          style={{ animationDelay: "0.1s" }}
                        >
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.description && (
                        <p
                          className="text-lg mb-8 text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in-up"
                          style={{ animationDelay: "0.2s" }}
                        >
                          {slide.description}
                        </p>
                      )}
                      {slide.buttonText && (
                        <Button
                          size="lg"
                          className="text-lg px-8 py-6 shadow-xl animate-fade-in-up"
                          style={{ animationDelay: "0.3s" }}
                        >
                          {slide.buttonText}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Arrows with Warmer Design */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-linear-to-r hover:from-purple-500/80 hover:via-pink-500/80 hover:to-orange-500/80 backdrop-blur-xl text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/30 shadow-xl z-20 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-linear-to-r hover:from-purple-500/80 hover:via-pink-500/80 hover:to-orange-500/80 backdrop-blur-xl text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/30 shadow-xl z-20 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Enhanced Slide Indicators with Warmer Colors */}
      <div className="hidden md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:flex md:space-x-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-4 h-4 rounded-full transition-all duration-300 border-2 border-white/40",
              currentSlide === index
                ? "bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 scale-125 shadow-lg"
                : "bg-white/40 hover:bg-white/70 hover:scale-110"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Progress Bar with Warmer Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-linear-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 backdrop-blur-sm">
        <div
          className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-100 ease-linear shadow-lg"
          style={{
            width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}
