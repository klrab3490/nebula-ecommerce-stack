"use client";

import { Send } from "lucide-react";
import StarRating from "./StarRating";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { isSignedIn } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim().length === 0) {
      setError("Please write a comment");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setRating(0);
      setComment("");

      // Call the callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-zinc-700/50 text-center">
        <p className="text-muted-foreground">Please sign in to leave a review</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-zinc-700/50">
      <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Your Rating</label>
          <StarRating rating={rating} interactive onRatingChange={setRating} size={32} />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold mb-2 text-foreground">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-base transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none placeholder:text-muted-foreground"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground mt-1">Minimum 10 characters</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-green-600 dark:text-green-400 text-sm">
            Review submitted successfully! Thank you for your feedback.
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Submit Review</span>
              </>
            )}
          </div>
        </Button>
      </form>
    </div>
  );
}
