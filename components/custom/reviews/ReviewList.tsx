"use client";

import { User } from "lucide-react";
import StarRating from "./StarRating";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ReviewListProps {
  productId: string;
  refreshTrigger?: number; // Used to trigger a refresh from parent
}

export default function ReviewList({ productId, refreshTrigger = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${productId}/reviews`);

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews);
        setStats({
          totalReviews: data.totalReviews,
          averageRating: data.averageRating,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-zinc-700/50 animate-pulse"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/6"></div>
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/30 dark:border-zinc-700/50 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-zinc-700/50">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-4xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={stats.averageRating} size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-zinc-700/50 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Review Header */}
            <div className="flex items-start gap-4 mb-4">
              {/* User Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Info and Rating */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-foreground">{review.user.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <StarRating rating={review.rating} size={16} />
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
