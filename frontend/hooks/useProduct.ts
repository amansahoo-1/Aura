import { useProductContext } from "@/context/ProductContext";
export function useProduct() {
  return useProductContext().product;
}
