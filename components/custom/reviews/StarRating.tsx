"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        const isPartiallyFilled = starValue - 0.5 <= displayRating && starValue > displayRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`relative transition-all duration-200 ${
              interactive ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"
            }`}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            {/* Background star (empty) */}
            <Star
              size={size}
              className="text-gray-300 dark:text-gray-600"
              fill="transparent"
              strokeWidth={2}
            />

            {/* Filled star */}
            {isFilled && (
              <Star
                size={size}
                className="absolute top-0 left-0 text-yellow-400"
                fill="currentColor"
                strokeWidth={2}
              />
            )}

            {/* Partially filled star */}
            {isPartiallyFilled && (
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
                <Star size={size} className="text-yellow-400" fill="currentColor" strokeWidth={2} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
