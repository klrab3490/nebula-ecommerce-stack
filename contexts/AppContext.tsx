"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Bundle, BundleDiscount, applyBestBundleDiscounts } from "@/lib/bundles";
import { createContext, useContext, useEffect, useState, useReducer, ReactNode } from "react";

// -------- Types --------
type Product = {
    id: string
    name: string
    price: number
    image: string
    alt: string
};

type UserData = {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown;
};

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variant?: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    bundles: Bundle[];
    appliedBundleDiscounts: BundleDiscount[];
    bundleDiscount: number;
    finalTotal: number;
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] }
    | { type: "SET_BUNDLES"; payload: Bundle[] }
    | { type: "APPLY_BUNDLE_DISCOUNTS" };

// -------- Helper function to calculate cart totals with bundles --------
const calculateCartTotals = (items: CartItem[], bundles: Bundle[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const bundleResult = applyBestBundleDiscounts(items, bundles);

    return {
        total,
        itemCount,
        appliedBundleDiscounts: bundleResult.appliedDiscounts,
        bundleDiscount: bundleResult.totalDiscount,
        finalTotal: bundleResult.finalTotal
    };
};

// -------- Cart Reducer --------
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find((item) => item.id === action.payload.id);
            const quantityToAdd = action.payload.quantity || 1;

            let newItems: CartItem[];
            if (existingItem) {
                newItems = state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: quantityToAdd }];
            }

            const totals = calculateCartTotals(newItems, state.bundles);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case "REMOVE_ITEM": {
            const newItems = state.items.filter((item) => item.id !== action.payload);
            const totals = calculateCartTotals(newItems, state.bundles);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case "UPDATE_QUANTITY": {
            const newItems = state.items
                .map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                        : item
                )
                .filter((item) => item.quantity > 0);

            const totals = calculateCartTotals(newItems, state.bundles);
            return {
                ...state,
                items: newItems,
                ...totals
            };
        }

        case "CLEAR_CART":
            return {
                items: [],
                total: 0,
                itemCount: 0,
                bundles: state.bundles,
                appliedBundleDiscounts: [],
                bundleDiscount: 0,
                finalTotal: 0
            };

        case "LOAD_CART": {
            const totals = calculateCartTotals(action.payload, state.bundles);
            return {
                ...state,
                items: action.payload,
                ...totals
            };
        }

        case "SET_BUNDLES": {
            const totals = calculateCartTotals(state.items, action.payload);
            return {
                ...state,
                bundles: action.payload,
                ...totals
            };
        }

        case "APPLY_BUNDLE_DISCOUNTS": {
            const totals = calculateCartTotals(state.items, state.bundles);
            return {
                ...state,
                ...totals
            };
        }

        default:
            return state;
    }
};

// -------- Context Type --------
interface AppContextType {
    currency: string | undefined;
    router: ReturnType<typeof useRouter>;
    isSeller: boolean;
    setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
    user: ReturnType<typeof useUser>["user"];
    userData: UserData | false;
    fetchUserData: () => Promise<void>;
    products: Product[];
    fetchProductData: () => Promise<void>;

    // Cart
    cart: CartState;
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;

    // Bundles
    fetchBundles: () => Promise<void>;
    applyBundleDiscounts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

interface AppContextProviderProps {
    children: ReactNode;
}

// -------- Provider --------
export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser();

    const [products, setProducts] = useState<Product[]>([]);
    const [userData, setUserData] = useState<UserData | false>(false);
    const [isSeller, setIsSeller] = useState<boolean>(false);

    // Cart state with reducer
    const [cart, dispatch] = useReducer(cartReducer, {
        items: [],
        total: 0,
        itemCount: 0,
        bundles: [],
        appliedBundleDiscounts: [],
        bundleDiscount: 0,
        finalTotal: 0,
    });

    // Sync Clerk user into our context state
    useEffect(() => {
        const syncUser = async () => {
            if (user) {
                setUserData({
                    id: user.id,
                    name: user.fullName || user.username || "Guest",
                    email: user.primaryEmailAddress?.emailAddress || "",
                    ...(user.publicMetadata?.role ? { role: user.publicMetadata.role } : {}),
                    ...user.publicMetadata,
                });
                if (user.publicMetadata?.role) {
                    setIsSeller(user.publicMetadata.role === "seller");
                }
                // Call API route to sync user with DB
                try {
                    await fetch("/api/user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: user.id,
                            name: user.fullName || user.username,
                            email: user.primaryEmailAddress?.emailAddress || "",
                            role: user.publicMetadata?.role || "buyer",
                        }),
                    });
                } catch (error) {
                    console.error("Error syncing user with DB:", error);
                }
            } else {
                setUserData(false);
            }
        };
        syncUser();
    }, [user]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: "LOAD_CART", payload: parsedCart });
            } catch (error) {
                console.error("Failed to load cart from localStorage:", error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart.items));
    }, [cart.items]);

    // Dummy fetchers
    const fetchProductData = async () => {
        setProducts([]); // replace with productsDummyData
    };

    const fetchUserData = async () => {
        setUserData(false); // replace with userDummyData
    };

    // Fetch bundles from API
    const fetchBundles = async () => {
        try {
            const response = await fetch('/api/bundles');
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "SET_BUNDLES", payload: data.bundles || [] });
            }
        } catch (error) {
            console.error('Error fetching bundles:', error);
        }
    };

    // Load bundles on mount
    useEffect(() => {
        fetchBundles();
    }, []);

    // Cart actions
    const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
        dispatch({ type: "ADD_ITEM", payload: item });
    const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
    const updateQuantity = (id: string, quantity: number) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });
    const applyBundleDiscounts = () => dispatch({ type: "APPLY_BUNDLE_DISCOUNTS" });

    const value: AppContextType = {
        currency,
        router,
        isSeller,
        setIsSeller,
        user,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        fetchBundles,
        applyBundleDiscounts,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
