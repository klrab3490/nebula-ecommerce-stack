"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SlideData {
    id: number
    type: "product" | "image-only"
    backgroundImage?: string
    productImage?: string
    title?: string
    subtitle?: string
    description?: string
    buttonText?: string
    buttonLink?: string
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
    }
]

    // {
    //     id: 11,
    //     type: "product",
    //     productImage: "/placeholder-4cqd6.png",
    //     title: "Premium Wireless Headphones",
    //     subtitle: "Crystal Clear Audio Experience",
    //     description:
    //         "Immerse yourself in studio-quality sound with our flagship wireless headphones featuring active noise cancellation.",
    //     buttonText: "Learn More",
    //     buttonLink: "#",
    // },

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
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
                                />
                            </div>
                        ) : (
                            // Product Slide
                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center">
                                <div className="container mx-auto px-6">
                                    <div className="grid md:grid-cols-2 gap-12 items-center">
                                        {/* Product Image */}
                                        <div className="flex justify-center">
                                            <Image
                                                src={slide.productImage || "/placeholder.svg"}
                                                alt={slide.title || "Product image"}
                                                className="object-contain drop-shadow-2xl"
                                                width={400}
                                                height={400}
                                            />
                                        </div>

                                        {/* Product Content */}
                                        <div className="text-center md:text-left">
                                            {slide.title && (
                                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{slide.title}</h1>
                                            )}
                                            {slide.subtitle && <p className="text-xl md:text-2xl mb-6 text-gray-600 dark:text-gray-300">{slide.subtitle}</p>}
                                            {slide.description && (
                                                <p className="text-lg mb-8 text-gray-700 dark:text-gray-200 leading-relaxed">{slide.description}</p>
                                            )}
                                            {slide.buttonText && (
                                                <Button size="lg" className="text-lg px-8 py-3">
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

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-200",
                            currentSlide === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75",
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{
                        width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : "0%",
                    }}
                />
            </div>
        </div>
    )
}
