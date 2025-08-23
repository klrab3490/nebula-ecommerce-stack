"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    variant?: string
}

interface CartState {
    items: CartItem[]
    total: number
    itemCount: number
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find((item) => item.id === action.payload.id)
            const quantityToAdd = action.payload.quantity || 1

            let newItems: CartItem[]
            if (existingItem) {
                newItems = state.items.map((item) =>
                    item.id === action.payload.id ? { ...item, quantity: item.quantity + quantityToAdd } : item,
                )
            } else {
                newItems = [...state.items, { ...action.payload, quantity: quantityToAdd }]
            }

            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            }
        }

        case "REMOVE_ITEM": {
            const newItems = state.items.filter((item) => item.id !== action.payload)
            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            }
        }

        case "UPDATE_QUANTITY": {
            const newItems = state.items
                .map((item) =>
                    item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
                )
                .filter((item) => item.quantity > 0)

            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            }
        }

        case "CLEAR_CART":
            return { items: [], total: 0, itemCount: 0 }

        case "LOAD_CART": {
            return {
                items: action.payload,
                total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
            }
        }

        default:
            return state
    }
}

interface CartContextType extends CartState {
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        total: 0,
        itemCount: 0,
    })

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                dispatch({ type: "LOAD_CART", payload: parsedCart })
            } catch (error) {
                console.error("Failed to load cart from localStorage:", error)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.items))
    }, [state.items])

    const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        dispatch({ type: "ADD_ITEM", payload: item })
    }

    const removeItem = (id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: id })
    }

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" })
    }

    return (
        <CartContext.Provider
            value={{
                ...state,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
