"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number
    images: string[]
    alt: string
    description: string
    features: string[]
    specifications: { [key: string]: string }
    faq: { question: string; answer: string }[]
}

const products: Product[] = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 299,
        originalPrice: 399,
        images: [
            "/premium-wireless-headphones-front.png",
            "/premium-wireless-headphones-side.png",
            "/premium-wireless-headphones-back.png",
        ],
        alt: "Premium wireless headphones with noise cancellation",
        description:
            "Experience superior sound quality with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.",
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Premium comfort padding",
            "Bluetooth 5.0 connectivity",
            "Quick charge technology",
            "Built-in microphone",
        ],
        specifications: {
            "Driver Size": "40mm",
            "Frequency Response": "20Hz - 20kHz",
            "Battery Life": "30 hours",
            "Charging Time": "2 hours",
            Weight: "250g",
            Connectivity: "Bluetooth 5.0, 3.5mm jack",
        },
        faq: [
            {
                question: "How long does the battery last?",
                answer: "The headphones provide up to 30 hours of continuous playback with ANC off, and 25 hours with ANC on.",
            },
            {
                question: "Are they compatible with all devices?",
                answer: "Yes, they work with any Bluetooth-enabled device and also include a 3.5mm cable for wired connection.",
            },
            {
                question: "What's included in the box?",
                answer: "Headphones, USB-C charging cable, 3.5mm audio cable, carrying case, and user manual.",
            },
        ],
    },
    {
        id: "2",
        name: "Smart Fitness Watch",
        price: 199,
        images: ["/smart-fitness-watch.png"],
        alt: "Smart fitness watch with health monitoring",
        description:
            "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS tracking, and 7-day battery life.",
        features: [
            "Heart rate monitoring",
            "GPS tracking",
            "7-day battery life",
            "Water resistant",
            "Sleep tracking",
            "Multiple sport modes",
        ],
        specifications: {
            Display: "1.4 inch AMOLED",
            "Battery Life": "7 days",
            "Water Resistance": "5ATM",
            Connectivity: "Bluetooth 5.0, Wi-Fi",
            Sensors: "Heart rate, GPS, Accelerometer",
            Compatibility: "iOS, Android",
        },
        faq: [
            {
                question: "Is it waterproof?",
                answer: "Yes, it has 5ATM water resistance, suitable for swimming and water sports.",
            },
            {
                question: "How accurate is the heart rate monitor?",
                answer: "The optical heart rate sensor provides medical-grade accuracy within 2-3 BPM.",
            },
        ],
    },
    {
        id: "3",
        name: "Portable Bluetooth Speaker",
        price: 79,
        images: ["/bluetooth-speaker.png"],
        alt: "Portable Bluetooth speaker with premium sound",
        description:
            "Enjoy rich, immersive sound anywhere with this portable Bluetooth speaker featuring 360-degree audio and 12-hour battery life.",
        features: [
            "360-degree sound",
            "12-hour battery",
            "Waterproof design",
            "Voice assistant support",
            "Portable design",
            "Premium drivers",
        ],
        specifications: {
            "Output Power": "20W",
            "Battery Life": "12 hours",
            Connectivity: "Bluetooth 5.0",
            "Water Rating": "IPX7",
            Dimensions: "180 x 65 x 65mm",
            Weight: "500g",
        },
        faq: [
            {
                question: "Can I pair multiple speakers?",
                answer: "Yes, you can pair two speakers for stereo sound or multiple speakers for party mode.",
            },
            {
                question: "How far is the Bluetooth range?",
                answer: "The Bluetooth range is up to 30 feet in open space.",
            },
        ],
    },
]

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const { addItem } = useAppContext();

    const product = products.find((p) => p.id === id)

    if (!product) {
        notFound()
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
        })
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/all-products"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to products
                </Link>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Card className="overflow-hidden p-0">
                            <CardContent className="p-0 relative">
                                <Image
                                    src={product.images[currentImageIndex] || "/placeholder.svg"}
                                    alt={product.alt}
                                    width={800}
                                    height={400}
                                    className="w-full h-96 object-cover"
                                />
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
                            </CardContent>
                        </Card>

                        {product.images.length > 1 && (
                            <div className="flex gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${currentImageIndex === index ? "border-primary" : "border-border"
                                            }`}
                                    >
                                        <Image
                                            src={image || "/placeholder.svg"}
                                            alt={`${product.name} view ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
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
                                <span className="text-3xl font-bold">${product.price}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                                        <Badge variant="destructive">Save ${product.originalPrice - product.price}</Badge>
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
                            <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                variant={isWishlisted ? "default" : "outline"}
                                size="lg"
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Specifications</h3>
                                <div className="space-y-3">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                                            <span className="text-muted-foreground">{key}</span>
                                            <span className="font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="max-w-7xl w-full">
                        {product.faq.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
