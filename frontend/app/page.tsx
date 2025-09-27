"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";

// --- Type Definitions ---
interface Product {
  id: number;
  name: string;
  oneTimeRentalFee: number;
  imageUrls: string[];
  seller: {
    brandName: string;
  };
}

// --- Main Page Component ---
// function AllProductsList() {
//   const searchParams = useSearchParams();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams(searchParams.toString());
//         if (!params.get("page")) params.set("page", "1");
//         if (!params.get("limit")) params.set("limit", "12");

//         const endpoint = params.has("q")
//           ? `/products/search?${params.toString()}`
//           : `/products?${params.toString()}`;

//         const response = await api.get(endpoint);
//         setProducts(response.data.data.data);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [searchParams]);

//   if (loading) {
//     return <div className="text-center py-20">Loading All Products...</div>;
//   }

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {products.map((product) => (
//           <Link
//             href={`/products/${product.id}`}
//             key={product.id}
//             className="group"
//           >
//             <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
//               <div className="relative w-full h-64">
//                 <Image
//                   src={product.imageUrls?.[0] || "/placeholder.png"}
//                   alt={product.name}
//                   fill
//                   sizes="(max-width: 768px) 100vw, 33vw"
//                   style={{ objectFit: "cover" }}
//                 />
//               </div>
//               <div className="p-4 border-t">
//                 <h2 className="text-md font-semibold text-gray-800 truncate">
//                   {product.name}
//                 </h2>
//                 <p className="text-purple-600 font-bold mt-2">
//                   Rent for ₹{product.oneTimeRentalFee.toLocaleString("en-IN")}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }

// Wrap with Suspense
export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <h1>HELLO DEVELOPER</h1>
      {/* <AllProductsList /> */}
    </Suspense>
  );
}
