import { useProduct } from "@/hooks/useProduct";

export default function RentalActions() {
  // Public access; buttons can trigger modals/login prompt for guests if you wish.
  const product = useProduct();
  return (
    <div className="mt-5 flex flex-wrap gap-4">
      <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        Rent Now
      </button>
      <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition">
        Add to Wishlist
      </button>
    </div>
  );
}
