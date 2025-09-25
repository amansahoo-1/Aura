import api from "@/lib/api";
import { notFound } from "next/navigation";
import { ProductProvider } from "@/context/ProductContext";
import ImageGallery from "@/components/products/ImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RentalActions from "@/components/products/RentalActions";
import ReviewsSection from "@/components/products/ReviewSection"; // Fix filename plural
import type { Product } from "@/types/product";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  return (
    <ProductProvider product={product}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 items-start">
          <div className="w-full">
            <ImageGallery />
          </div>
          <div className="lg:sticky top-28">
            <ProductInfo />
            <RentalActions />
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-200 pt-12 max-w-4xl mx-auto">
          <ReviewsSection />
        </div>
      </div>
    </ProductProvider>
  );
}
