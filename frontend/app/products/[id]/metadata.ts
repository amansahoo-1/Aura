import api from "@/lib/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await api.get(`/products/${params.id}`);
    const product = res.data.data;
    if (!product) {
      return {
        title: "Product Not Found | Aura",
        description:
          "The jewellery piece you are looking for could not be found.",
      };
    }
    return {
      title: `${product.name} - Aura Jewellery Rental`,
      description: `Rent the exquisite ${product.name} by ${product.seller.brandName}. ${product.description}`,
      openGraph: { images: [product.imageUrls?.[0] || ""] },
    };
  } catch {
    return {
      title: "Product Not Found | Aura",
      description:
        "The jewellery piece you are looking for could not be found.",
    };
  }
}
