import { getCurrencySymbol, formatCurrency } from "@/lib/currency";

describe("Currency Utilities", () => {
  describe("getCurrencySymbol", () => {
    it("should return correct symbol for USD", () => {
      expect(getCurrencySymbol("USD")).toBe("$");
    });

    it("should return correct symbol for EUR", () => {
      expect(getCurrencySymbol("EUR")).toBe("€");
    });

    it("should return correct symbol for GBP", () => {
      expect(getCurrencySymbol("GBP")).toBe("£");
    });

    it("should return correct symbol for INR", () => {
      expect(getCurrencySymbol("INR")).toBe("₹");
    });

    it("should return correct symbol for JPY", () => {
      expect(getCurrencySymbol("JPY")).toBe("¥");
    });

    it("should handle unknown currency by returning the code", () => {
      expect(getCurrencySymbol("XYZ")).toBe("XYZ");
    });

    it("should handle case insensitive input", () => {
      expect(getCurrencySymbol("usd")).toBe("$");
      expect(getCurrencySymbol("Eur")).toBe("€");
    });

    it("should use default from environment when no currency provided", () => {
      const originalEnv = process.env.NEXT_PUBLIC_CURRENCY;
      process.env.NEXT_PUBLIC_CURRENCY = "EUR";

      expect(getCurrencySymbol()).toBe("€");

      process.env.NEXT_PUBLIC_CURRENCY = originalEnv;
    });

    it("should default to USD when no currency provided and no env set", () => {
      const originalEnv = process.env.NEXT_PUBLIC_CURRENCY;
      delete process.env.NEXT_PUBLIC_CURRENCY;

      expect(getCurrencySymbol()).toBe("$");

      process.env.NEXT_PUBLIC_CURRENCY = originalEnv;
    });
  });

  describe("formatCurrency", () => {
    it("should format USD correctly with 2 decimal places", () => {
      expect(formatCurrency(99.99, "USD")).toBe("$99.99");
    });

    it("should format EUR correctly", () => {
      expect(formatCurrency(50.5, "EUR")).toBe("€50.50");
    });

    it("should format whole numbers with .00", () => {
      expect(formatCurrency(100, "USD")).toBe("$100.00");
    });

    it("should handle negative amounts", () => {
      expect(formatCurrency(-25.99, "USD")).toBe("$-25.99");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0, "USD")).toBe("$0.00");
    });

    it("should round to 2 decimal places", () => {
      expect(formatCurrency(99.999, "USD")).toBe("$100.00");
      expect(formatCurrency(99.994, "USD")).toBe("$99.99");
    });

    it("should use default currency from environment", () => {
      const originalEnv = process.env.NEXT_PUBLIC_CURRENCY;
      process.env.NEXT_PUBLIC_CURRENCY = "INR";

      expect(formatCurrency(100)).toBe("₹100.00");

      process.env.NEXT_PUBLIC_CURRENCY = originalEnv;
    });

    it("should handle large amounts", () => {
      expect(formatCurrency(1234567.89, "USD")).toBe("$1234567.89");
    });
  });
});
