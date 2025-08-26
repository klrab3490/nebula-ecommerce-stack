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
    <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real stories from people who&#39;ve experienced the natural goodness of Nikantha products
          </p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-emerald-200 dark:border-gray-700 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:border-emerald-300 dark:hover:border-emerald-400 rounded-full shadow-lg transition-all duration-200 -translate-x-4 md:-translate-x-8"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-xl border border-emerald-100 dark:border-gray-800 transition-all duration-500 transform">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-100 dark:border-gray-700"
                    width={80}
                    height={80}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  {/* Product badge */}
                  <div className="inline-block bg-emerald-100 dark:bg-gray-800 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {testimonials[currentIndex].product}
                  </div>

                  {/* Star rating */}
                  <div className="flex justify-center md:justify-start">
                    <StarRating rating={testimonials[currentIndex].rating} />
                  </div>

                  {/* Testimonial text */}
                  <blockquote className="text-gray-700 dark:text-gray-200 text-lg md:text-xl leading-relaxed mb-6 italic">
                    &quot;{testimonials[currentIndex].text}&quot;
                  </blockquote>

                  {/* Customer info */}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">{testimonials[currentIndex].location}</p>
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
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-emerald-200 dark:border-gray-700 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:border-emerald-300 dark:hover:border-emerald-400 rounded-full shadow-lg transition-all duration-200 translate-x-4 md:translate-x-8"
          >
            <ChevronRight className="w-5 h-5" />
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
