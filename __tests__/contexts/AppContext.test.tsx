import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppContextProvider, useAppContext, CartItem } from "@/contexts/AppContext";

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(() => ({
    user: null,
    isLoaded: true,
  })),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: "/",
  })),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test component to interact with context
const TestComponent = () => {
  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    currency
  } = useAppContext();

  const sampleItem: Omit<CartItem, "quantity"> = {
    id: "test-1",
    name: "Test Product",
    price: 29.99,
    image: "/test.jpg",
  };

  return (
    <div>
      <div data-testid="cart-count">{cart.itemCount}</div>
      <div data-testid="cart-total">{cart.total.toFixed(2)}</div>
      <div data-testid="currency">{currency || "$"}</div>
      <div data-testid="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}>
            {item.name} - Qty: {item.quantity} - ${item.price}
          </div>
        ))}
      </div>

      <button onClick={() => addItem(sampleItem)} data-testid="add-item">
        Add Item
      </button>
      <button onClick={() => addItem({ ...sampleItem, quantity: 3 })} data-testid="add-multiple">
        Add Multiple
      </button>
      <button onClick={() => removeItem("test-1")} data-testid="remove-item">
        Remove Item
      </button>
      <button onClick={() => updateQuantity("test-1", 5)} data-testid="update-quantity">
        Update Quantity
      </button>
      <button onClick={clearCart} data-testid="clear-cart">
        Clear Cart
      </button>
    </div>
  );
};

describe("AppContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it("provides default values", () => {
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByTestId("cart-total")).toHaveTextContent("0.00");
    expect(screen.getByTestId("currency")).toHaveTextContent("$");
  });

  it("throws error when used outside provider", () => {
    // Suppress console error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAppContext must be used within an AppContextProvider");

    consoleSpy.mockRestore();
  });

  describe("Cart functionality", () => {
    it("adds items to cart", () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      fireEvent.click(screen.getByTestId("add-item"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("29.99");
      expect(screen.getByTestId("cart-item-test-1")).toHaveTextContent(
        "Test Product - Qty: 1 - $29.99"
      );
    });

    it("increases quantity when adding existing item", () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      // Add item twice
      fireEvent.click(screen.getByTestId("add-item"));
      fireEvent.click(screen.getByTestId("add-item"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("59.98");
      expect(screen.getByTestId("cart-item-test-1")).toHaveTextContent(
        "Test Product - Qty: 2 - $29.99"
      );
    });

    it("adds multiple items at once", () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      fireEvent.click(screen.getByTestId("add-multiple"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("3");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("89.97");
      expect(screen.getByTestId("cart-item-test-1")).toHaveTextContent(
        "Test Product - Qty: 3 - $29.99"
      );
    });

    it("removes items from cart", () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      // Add then remove
      fireEvent.click(screen.getByTestId("add-item"));
      fireEvent.click(screen.getByTestId("remove-item"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("0.00");
      expect(screen.queryByTestId("cart-item-test-1")).not.toBeInTheDocument();
    });

    it("updates item quantity", () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      // Add item then update quantity
      fireEvent.click(screen.getByTestId("add-item"));
      fireEvent.click(screen.getByTestId("update-quantity"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("5");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("149.95");
      expect(screen.getByTestId("cart-item-test-1")).toHaveTextContent(
        "Test Product - Qty: 5 - $29.99"
      );
    });

    it("removes item when quantity is updated to 0", () => {
      const TestComponentWithZeroUpdate = () => {
        const { cart, addItem, updateQuantity } = useAppContext();
        const sampleItem: Omit<CartItem, "quantity"> = {
          id: "test-1",
          name: "Test Product",
          price: 29.99,
        };

        return (
          <div>
            <div data-testid="cart-count">{cart.itemCount}</div>
            <button onClick={() => addItem(sampleItem)} data-testid="add-item">
              Add Item
            </button>
            <button onClick={() => updateQuantity("test-1", 0)} data-testid="update-to-zero">
              Update to Zero
            </button>
          </div>
        );
      };

      render(
        <AppContextProvider>
          <TestComponentWithZeroUpdate />
        </AppContextProvider>
      );

      fireEvent.click(screen.getByTestId("add-item"));
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");

      fireEvent.click(screen.getByTestId("update-to-zero"));
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    });

    it("clears entire cart", () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      // Add items then clear
      fireEvent.click(screen.getByTestId("add-item"));
      fireEvent.click(screen.getByTestId("add-multiple"));
      fireEvent.click(screen.getByTestId("clear-cart"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("0.00");
      expect(screen.queryByTestId("cart-item-test-1")).not.toBeInTheDocument();
    });

    it("persists cart to localStorage", async () => {
      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      fireEvent.click(screen.getByTestId("add-item"));

      // Wait for localStorage to be updated
      await waitFor(() => {
        const savedCart = localStorageMock.getItem("cart");
        expect(savedCart).toBeTruthy();

        const parsedCart = JSON.parse(savedCart!);
        expect(parsedCart).toHaveLength(1);
        expect(parsedCart[0].name).toBe("Test Product");
      });
    });

    it("loads cart from localStorage on mount", () => {
      // Pre-populate localStorage
      const savedCartData = [
        {
          id: "saved-1",
          name: "Saved Product",
          price: 19.99,
          quantity: 2,
        },
      ];
      localStorageMock.setItem("cart", JSON.stringify(savedCartData));

      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("39.98");
    });

    it("handles corrupted localStorage data gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

      // Set invalid JSON in localStorage
      localStorageMock.setItem("cart", "invalid json");

      render(
        <AppContextProvider>
          <TestComponent />
        </AppContextProvider>
      );

      // Should start with empty cart
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("0.00");

      consoleSpy.mockRestore();
    });

    it("calculates totals correctly with multiple items", () => {
      const MultipleItemsTest = () => {
        const { cart, addItem } = useAppContext();

        return (
          <div>
            <div data-testid="cart-count">{cart.itemCount}</div>
            <div data-testid="cart-total">{cart.total.toFixed(2)}</div>
            <button
              onClick={() => addItem({ id: "item-1", name: "Item 1", price: 10.50, quantity: 2 })}
              data-testid="add-item-1"
            >
              Add Item 1
            </button>
            <button
              onClick={() => addItem({ id: "item-2", name: "Item 2", price: 25.99, quantity: 1 })}
              data-testid="add-item-2"
            >
              Add Item 2
            </button>
          </div>
        );
      };

      render(
        <AppContextProvider>
          <MultipleItemsTest />
        </AppContextProvider>
      );

      fireEvent.click(screen.getByTestId("add-item-1"));
      fireEvent.click(screen.getByTestId("add-item-2"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("3"); // 2 + 1
      expect(screen.getByTestId("cart-total")).toHaveTextContent("46.99"); // (10.50 * 2) + (25.99 * 1)
    });
  });
});