"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StarRating } from "@/components/custom/StarRating"

const testimonials = [
  {
    id: 1,
    text: "Nikantha's herbal henna is simply amazing! It gave my hair a beautiful natural color and made it so soft and shiny. I've stopped using chemical dyes completely.",
    name: "Aparna Nair",
    location: "Thrissur",
    rating: 4,
    product: "Herbal Henna",
    avatar: "/indian-woman-with-beautiful-hair.png",
  },
  {
    id: 2,
    text: "I started using Nikantha hair oil just a month ago, and the difference is visible. My hair fall has reduced, and my scalp feels much healthier now.",
    name: "Rahim KP",
    location: "Kozhikode",
    rating: 5,
    product: "Hair Oil",
    avatar: "/indian-man-with-healthy-hair.png",
  },
  {
    id: 3,
    text: "Their face pack is a lifesaver! It cleared up my pimples and left my skin smooth and fresh. The best part is, it's 100% natural.",
    name: "Sreeja Menon",
    location: "Ernakulam",
    rating: 5,
    product: "Face Pack",
    avatar: "/indian-woman-with-glowing-skin.png",
  },
]

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }


  return (
    <section className="py-20 w-full relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            💬 What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Real stories from people who&#39;ve experienced the natural goodness of our premium products
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl -translate-x-4 md:-translate-x-8 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Button>

          <div className="max-w-4xl mx-auto relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 animate-pulse"></div>

            {/* Main Card */}
            <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 dark:border-zinc-700/50 transition-all duration-500">
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 rounded-3xl"></div>

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Enhanced Avatar */}
                <div className="flex-shrink-0 relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50 animate-pulse"></div>
                  <Image
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
                    width={96}
                    height={96}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  {/* Enhanced Product badge */}
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                    ✨ {testimonials[currentIndex].product}
                  </div>

                  {/* Enhanced Star rating */}
                  <div className="flex justify-center md:justify-start mb-4">
                    <StarRating rating={testimonials[currentIndex].rating} />
                  </div>

                  {/* Enhanced Testimonial text */}
                  <blockquote className="text-foreground text-lg md:text-xl leading-relaxed mb-6 italic font-medium relative">
                    <span className="text-6xl text-purple-300 dark:text-purple-700 absolute -top-4 -left-2 opacity-50">&quot;</span>
                    <span className="relative z-10">{testimonials[currentIndex].text}</span>
                    <span className="text-6xl text-purple-300 dark:text-purple-700 absolute -bottom-8 -right-2 opacity-50">&quot;</span>
                  </blockquote>

                  {/* Enhanced Customer info */}
                  <div>
                    <h4 className="font-black text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{testimonials[currentIndex].name}</h4>
                    <p className="text-muted-foreground font-medium">📍 {testimonials[currentIndex].location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, idx) => {
                const activeClass = idx === currentIndex
                  ? "w-8 h-3 bg-emerald-500 dark:bg-emerald-400"
                  : "w-3 h-3 bg-emerald-200 dark:bg-gray-700 hover:bg-emerald-300 dark:hover:bg-emerald-500";
                return (
                  <button
                    key={idx}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${activeClass}`}
                    onClick={() => goToTestimonial(idx)}
                  ></button>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl translate-x-4 md:translate-x-8 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAutoPlaying ? "⏸️ Pause auto-play" : "▶️ Resume auto-play"}
          </button>
        </div>
      </div>
    </section>
  )
}
