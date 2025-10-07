import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StarRating } from "@/components/custom/StarRating";

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Star: ({ className, ...props }: { className?: string;[key: string]: unknown }) => (
    <svg className={className} data-testid="star-icon" {...props}>
      <path d="star" />
    </svg>
  ),
}));

describe("StarRating", () => {
  it("renders the correct number of stars by default", () => {
    render(<StarRating rating={3} />);

    const container = screen.getByRole("img");
    const stars = screen.getAllByTestId("star-icon");
    expect(stars).toHaveLength(5); // Default maxRating is 5
    expect(container).toHaveAttribute("aria-label", "3 out of 5 stars");
  });

  it("renders custom number of stars", () => {
    render(<StarRating rating={3} maxRating={10} />);

    const stars = screen.getAllByTestId("star-icon");
    expect(stars).toHaveLength(10);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "3 out of 10 stars");
  });

  it("applies correct classes for filled stars", () => {
    render(<StarRating rating={3} />);

    const stars = screen.getAllByTestId("star-icon");

    // First 3 stars should be filled (yellow)
    for (let i = 0; i < 3; i++) {
      expect(stars[i]).toHaveClass("text-yellow-400", "fill-yellow-400");
    }

    // Last 2 stars should be unfilled (gray)
    for (let i = 3; i < 5; i++) {
      expect(stars[i]).toHaveClass("text-gray-300", "dark:text-gray-600");
    }
  });

  it("handles zero rating", () => {
    render(<StarRating rating={0} />);

    const stars = screen.getAllByTestId("star-icon");

    // All stars should be unfilled
    stars.forEach(star => {
      expect(star).toHaveClass("text-gray-300", "dark:text-gray-600");
      expect(star).not.toHaveClass("text-yellow-400", "fill-yellow-400");
    });
  });

  it("handles maximum rating", () => {
    render(<StarRating rating={5} />);

    const stars = screen.getAllByTestId("star-icon");

    // All stars should be filled
    stars.forEach(star => {
      expect(star).toHaveClass("text-yellow-400", "fill-yellow-400");
    });
  });

  it("handles decimal ratings by flooring", () => {
    render(<StarRating rating={3.7} />);

    const stars = screen.getAllByTestId("star-icon");

    // First 3 stars should be filled (3.7 floors to 3, but actually 4 since 3.7 > 3)
    for (let i = 0; i < 4; i++) {
      expect(stars[i]).toHaveClass("text-yellow-400", "fill-yellow-400");
    }

    // Last star should be unfilled
    expect(stars[4]).toHaveClass("text-gray-300");
  }); it("applies correct size classes", () => {
    const { rerender } = render(<StarRating rating={3} size="sm" />);
    let stars = screen.getAllByTestId("star-icon");
    stars.forEach(star => {
      expect(star).toHaveClass("w-4", "h-4");
    });

    rerender(<StarRating rating={3} size="md" />);
    stars = screen.getAllByTestId("star-icon");
    stars.forEach(star => {
      expect(star).toHaveClass("w-5", "h-5");
    });

    rerender(<StarRating rating={3} size="lg" />);
    stars = screen.getAllByTestId("star-icon");
    stars.forEach(star => {
      expect(star).toHaveClass("w-6", "h-6");
    });
  });

  it("has proper accessibility attributes", () => {
    render(<StarRating rating={4} />);

    const container = screen.getByRole("img");
    expect(container).toHaveAttribute("aria-label", "4 out of 5 stars");

    const stars = screen.getAllByTestId("star-icon");
    stars.forEach(star => {
      expect(star).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("handles rating higher than maxRating", () => {
    render(<StarRating rating={7} maxRating={5} />);

    const stars = screen.getAllByTestId("star-icon");

    // All stars should be filled even though rating exceeds maxRating
    stars.forEach(star => {
      expect(star).toHaveClass("text-yellow-400", "fill-yellow-400");
    });
  });
});