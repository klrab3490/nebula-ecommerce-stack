import { calculateBundleDiscounts, applyBestBundleDiscounts, Bundle } from "@/lib/bundles";
import { CartItem } from "@/contexts/AppContext";

describe("Bundle Utilities", () => {
  const mockProduct1 = {
    id: "prod1",
    name: "Product 1",
    price: 100,
    images: [],
    stock: 10,
  };

  const mockProduct2 = {
    id: "prod2",
    name: "Product 2",
    price: 50,
    images: [],
    stock: 10,
  };

  describe("calculateBundleDiscounts", () => {
    it("should calculate percentage discount correctly", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 2, price: 100, image: "" },
      ];

      const bundle: Bundle = {
        id: "bundle1",
        name: "20% Off Bundle",
        description: "Get 20% off",
        discountType: "percentage",
        discountValue: 20,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const discounts = calculateBundleDiscounts(cartItems, [bundle]);

      expect(discounts).toHaveLength(1);
      expect(discounts[0].discount).toBe(40); // 20% of 200
      expect(discounts[0].discountedPrice).toBe(160);
    });

    it("should calculate fixed discount correctly", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 1, price: 100, image: "" },
      ];

      const bundle: Bundle = {
        id: "bundle1",
        name: "$30 Off Bundle",
        description: "Get $30 off",
        discountType: "fixed",
        discountValue: 30,
        minQuantity: 1,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 1,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const discounts = calculateBundleDiscounts(cartItems, [bundle]);

      expect(discounts).toHaveLength(1);
      expect(discounts[0].discount).toBe(30);
      expect(discounts[0].discountedPrice).toBe(70);
    });

    it("should not apply discount if minimum quantity not met", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 1, price: 100, image: "" },
      ];

      const bundle: Bundle = {
        id: "bundle1",
        name: "Bundle",
        description: "Need 2 items",
        discountType: "percentage",
        discountValue: 20,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const discounts = calculateBundleDiscounts(cartItems, [bundle]);

      expect(discounts).toHaveLength(0);
    });

    it("should not apply discount if bundle is inactive", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 2, price: 100, image: "" },
      ];

      const bundle: Bundle = {
        id: "bundle1",
        name: "Inactive Bundle",
        description: "Inactive",
        discountType: "percentage",
        discountValue: 20,
        minQuantity: 2,
        isActive: false,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const discounts = calculateBundleDiscounts(cartItems, [bundle]);

      expect(discounts).toHaveLength(0);
    });

    it("should not apply discount if bundle has expired", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 2, price: 100, image: "" },
      ];

      const bundle: Bundle = {
        id: "bundle1",
        name: "Expired Bundle",
        description: "Expired",
        discountType: "percentage",
        discountValue: 20,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-01-02"), // Expired
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const discounts = calculateBundleDiscounts(cartItems, [bundle]);

      expect(discounts).toHaveLength(0);
    });

    it("should handle buy_x_get_y discount type", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 3, price: 100, image: "" },
      ];

      const bundle: Bundle = {
        id: "bundle1",
        name: "Buy 2 Get 1",
        description: "Buy 2 get 1 free",
        discountType: "buy_x_get_y",
        discountValue: 1, // 1 free item
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 3,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const discounts = calculateBundleDiscounts(cartItems, [bundle]);

      expect(discounts).toHaveLength(1);
      expect(discounts[0].discount).toBeGreaterThan(0);
    });
  });

  describe("applyBestBundleDiscounts", () => {
    it("should apply the highest discount when multiple bundles available", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 2, price: 100, image: "" },
      ];

      const bundle1: Bundle = {
        id: "bundle1",
        name: "10% Off",
        description: "10% off",
        discountType: "percentage",
        discountValue: 10,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const bundle2: Bundle = {
        id: "bundle2",
        name: "20% Off",
        description: "20% off",
        discountType: "percentage",
        discountValue: 20,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp2",
            bundleId: "bundle2",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const result = applyBestBundleDiscounts(cartItems, [bundle1, bundle2]);

      expect(result.appliedDiscounts).toHaveLength(1);
      expect(result.appliedDiscounts[0].bundleId).toBe("bundle2"); // 20% is better
      expect(result.totalDiscount).toBe(40); // 20% of 200
    });

    it("should avoid overlapping discounts", () => {
      const cartItems: CartItem[] = [
        { id: "prod1", name: "Product 1", quantity: 2, price: 100, image: "" },
        { id: "prod2", name: "Product 2", quantity: 2, price: 50, image: "" },
      ];

      const bundle1: Bundle = {
        id: "bundle1",
        name: "Bundle 1",
        description: "Prod1 discount",
        discountType: "percentage",
        discountValue: 20,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp1",
            bundleId: "bundle1",
            productId: "prod1",
            quantity: 2,
            isRequired: true,
            product: mockProduct1,
          },
        ],
      };

      const bundle2: Bundle = {
        id: "bundle2",
        name: "Bundle 2",
        description: "Prod1+Prod2 discount",
        discountType: "percentage",
        discountValue: 15,
        minQuantity: 2,
        isActive: true,
        validFrom: new Date("2024-01-01"),
        BundleProduct: [
          {
            id: "bp2",
            bundleId: "bundle2",
            productId: "prod1",
            quantity: 1,
            isRequired: true,
            product: mockProduct1,
          },
          {
            id: "bp3",
            bundleId: "bundle2",
            productId: "prod2",
            quantity: 1,
            isRequired: true,
            product: mockProduct2,
          },
        ],
      };

      const result = applyBestBundleDiscounts(cartItems, [bundle1, bundle2]);

      // Should apply bundle1 (higher discount) and not bundle2 (overlapping prod1)
      expect(result.appliedDiscounts).toHaveLength(1);
      expect(result.appliedDiscounts[0].bundleId).toBe("bundle1");
    });
  });
});
