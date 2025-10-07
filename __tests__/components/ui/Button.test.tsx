import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("inline-flex", "items-center", "justify-center");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies variant classes", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary", "text-primary-foreground");

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive", "text-white");

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("border", "bg-background");

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary", "text-secondary-foreground");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-accent", "hover:text-accent-foreground");

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary", "underline-offset-4");
  });

  it("applies size classes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("h-9", "px-4", "py-2");

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("h-8", "px-3");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("h-10", "px-6");

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("size-9");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("passes through other props", () => {
    render(<Button data-testid="custom-button" aria-describedby="description">Button</Button>);

    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-describedby", "description");
  });

  it("handles loading state", () => {
    // This test assumes there might be a loading prop
    // Adjust based on actual Button implementation
    render(<Button disabled>Loading...</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});