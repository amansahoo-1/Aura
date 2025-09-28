"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { Wishlist, WishlistItem } from "@/types";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<number>>(
    new Set()
  );
  const { isAuthenticated, user } = useAuth();

  // The best way to fix this is to wrap fetchWishlist in the useCallback hook.
  //  This memoizes the function, meaning it won't be re-created on every render unless its own dependencies change.
  //  This makes your code more stable and performant.
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "USER") {
      setWishlistItems([]);
      setWishlistProductIds(new Set());
      return;
    }
    try {
      const response = await api.get("/wishlist");
      const items = response.data.data.items || [];
      setWishlistItems(items);
      setWishlistProductIds(
        new Set(items.map((item: WishlistItem) => item.product.id))
      );
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: number) => wishlistProductIds.has(productId);

  const toggleWishlist = async (productId: number) => {
    try {
      if (isInWishlist(productId)) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post("/wishlist", { productId });
      }
      await fetchWishlist(); // Refresh wishlist after action
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
