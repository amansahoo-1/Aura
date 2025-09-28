"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { Cart, CartItem } from "@/types";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // assuming useAuth provides authentication status and user info
  const { isAuthenticated, user } = useAuth();

  const fetchCart = useCallback(async () => {
    // Only fetch if authenticated AND the role is 'USER'
    if (!isAuthenticated || user?.role !== "USER") {
      setCart(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.get("/cart");
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null); // Reset cart on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    try {
      const response = await api.post("/cart/items", { productId, quantity });
      setCart(response.data.data);
      // Add a user notification here (e.g., toast)
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  }, []); //no dependecy needed as 'setCart' is stable

  const removeFromCart = useCallback(
    async (productId: number) => {
      try {
        await api.delete(`/cart/items/${productId}`);
        await fetchCart(); // Re-fetch the cart to get updated totals
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    },
    [fetchCart] //depends on the memoized fetchCart
  );

  const clearCart = useCallback(async () => {
    try {
      await api.delete("/cart/clear");
      setCart(null);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, []);

  const itemCount = cart?.meta?.itemCount ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
