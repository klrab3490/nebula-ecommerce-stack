"use client";

import React from "react";
import { getPalette } from "@/components/theme/colorPalette";
import { Heart, Leaf, Sun, Gift, Star } from "lucide-react";

type Category = {
    name: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    emoji: string;
};

const categories: Category[] = [
    {
        name: "Hair Care",
        description: "Oils, serums and treatments for healthy hair",
        icon: Star,
        emoji: "💇‍♀️",
    },
    {
        name: "Skincare",
        description: "Cleansers, serums and moisturizers for glowing skin",
        icon: Sun,
        emoji: "🌞",
    },
    {
        name: "Wellness",
        description: "Supplements and self-care essentials",
        icon: Leaf,
        emoji: "🌿",
    },
    {
        name: "Gifts",
        description: "Curated gift sets for every occasion",
        icon: Gift,
        emoji: "🎁",
    },
    {
        name: "Favorites",
        description: "Top rated and fan-favorite products",
        icon: Heart,
        emoji: "❤️",
    },
];

export default function CategoriesSection() {
    return (
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            {/* Enhanced Section Title */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    🛍️ Shop by Category
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                    Explore our curated collection of premium beauty and wellness products
                </p>
                <div className="w-24 h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Enhanced Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    const palette = getPalette(index);
                    return (
                        <div
                            key={index}
                            className="group relative overflow-hidden cursor-pointer"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Glow Effect */}
                            <div
                                className={`absolute -inset-0.5 bg-linear-to-r ${palette.gradient} rounded-3xl blur opacity-0 group-hover:opacity-40 transition-all duration-500 ${palette.glowClass}`}
                            ></div>

                            {/* Main Card */}
                            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/30 dark:border-zinc-700/50 overflow-hidden group-hover:bg-white/90 dark:group-hover:bg-zinc-900/90">
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                                {/* Icon Container with Enhanced Effects */}
                                <div className="relative mb-6">
                                    <div
                                        className={`absolute inset-0 bg-linear-to-br ${palette.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 animate-glow`}
                                    ></div>
                                    <div
                                        className={`relative bg-linear-to-br ${palette.gradient} rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-500 animate-float`}
                                    >
                                        <IconComponent className="h-12 w-12 text-white mx-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    {/* Emoji Overlay */}
                                    <div className="absolute -top-2 -right-2 text-2xl group-hover:scale-125 transition-transform duration-300">
                                        {category.emoji}
                                    </div>
                                </div>

                                {/* Enhanced Text */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-foreground group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Interactive Arrow */}
                                <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
                <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full px-6 py-3 text-muted-foreground font-medium">
                    <span>✨ Discover premium quality products</span>
                </div>
            </div>
        </div>
    );
}
