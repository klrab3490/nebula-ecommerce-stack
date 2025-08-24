"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

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

            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }

        case "REMOVE_ITEM": {
            const newItems = state.items.filter((item) => item.id !== action.payload);
            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
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

            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }

        case "CLEAR_CART":
            return { items: [], total: 0, itemCount: 0 };

        case "LOAD_CART": {
            return {
                items: action.payload,
                total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
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
    });

    // Sync Clerk user into our context state
    useEffect(() => {
        if (user) {
            setUserData({
                id: user.id,
                name: user.fullName || user.username || "Guest",
                email: user.primaryEmailAddress?.emailAddress || "",
                ...(user.publicMetadata?.role ? { role: user.publicMetadata.role } : {}),
                ...user.publicMetadata, // optional: attach Clerk metadata
            });
            if (user.publicMetadata?.role) {
                setIsSeller(user.publicMetadata.role === "seller");
            }
        } else {
            setUserData(false);
        }
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

    // Cart actions
    const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
        dispatch({ type: "ADD_ITEM", payload: item });
    const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
    const updateQuantity = (id: string, quantity: number) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });

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
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
