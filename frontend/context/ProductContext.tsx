"use client";
import { createContext, useContext, ReactNode } from "react";
import type { Product } from "@/types/product";

type ProductContextType = { product: Product };
const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  return (
    <ProductContext.Provider value={{ product }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProductContext must be used within ProductProvider");
  return ctx;
}
