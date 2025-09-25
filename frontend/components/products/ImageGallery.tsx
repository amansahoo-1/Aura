import { useProduct } from "@/hooks/useProduct";

export default function ImageGallery() {
  const product = useProduct();
  return (
    <div className="flex flex-col gap-3">
      {product.imageUrls && product.imageUrls.length > 0 ? (
        product.imageUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Product image ${idx + 1}`}
            className="rounded-lg object-cover max-h-96 w-full"
          />
        ))
      ) : (
        <div className="text-gray-400">No images available.</div>
      )}
    </div>
  );
}
