import { Star } from "lucide-react"

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, maxRating = 5, size = "sm" }: StarRatingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    }

    return (
        <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
            {Array.from({ length: maxRating }, (_, i) => (
                <Star
                    key={i}
                    className={`${sizeClasses[size]} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                        }`}
                    aria-hidden="true"
                />
            ))}
        </div>
    )
}
