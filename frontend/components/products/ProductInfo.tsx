import { useProduct } from "@/hooks/useProduct";

export default function ProductInfo() {
  const product = useProduct();
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-lg text-gray-600 mt-1">{product.seller.brandName}</p>
      <div className="text-xl font-semibold text-indigo-600 mt-3">
        ₹{product.oneTimeRentalFee}
      </div>
      <div className="grid grid-cols-2 gap-x-6 mt-4 text-gray-700 text-sm">
        <div>
          <span className="font-semibold">Category:</span> {product.category}
        </div>
        <div>
          <span className="font-semibold">Material:</span> {product.material}
        </div>
      </div>
    </div>
  );
}
