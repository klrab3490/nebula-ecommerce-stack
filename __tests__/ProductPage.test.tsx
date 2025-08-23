import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import ProductPage from "@/app/products/[id]/page"

// Mock Next.js navigation utilities
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}))

describe("ProductPage", () => {
  const baseParams = { id: "1" }

  it("renders product details correctly", async () => {
    render(await ProductPage({ params: baseParams }))

    expect(
      await screen.findByRole("heading", { name: /Premium Wireless Headphones/i })
    ).toBeInTheDocument()

    expect(screen.getByText("$299")).toBeInTheDocument()
    expect(screen.getByText("Save $100")).toBeInTheDocument()
  })

  it("shows product description", async () => {
    render(await ProductPage({ params: baseParams }))

    expect(
      screen.getByText(/Experience superior sound quality/i)
    ).toBeInTheDocument()
  })

  it("can toggle wishlist button", async () => {
    render(await ProductPage({ params: baseParams }))

    const wishlistButton = screen.getByRole("button", { name: "" }) // Heart button has no text
    fireEvent.click(wishlistButton)

    // After clicking, it should have "default" variant (filled heart)
    expect(wishlistButton).toHaveClass("bg-primary") // shadcn default button styling
  })

  it("renders FAQ section", async () => {
    render(await ProductPage({ params: baseParams }))

    expect(
      screen.getByRole("heading", { name: /Frequently Asked Questions/i })
    ).toBeInTheDocument()

    expect(screen.getByText(/How long does the battery last/i)).toBeInTheDocument()
  })
})
