import React from "react";

export const metadata = {
  title: "Product Details | Aura",
  description: "View the details of our exquisite jewellery collection.",
};

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout can be customized with elements specific to product pages,
  // like a special header, a breadcrumb navigation, or a sidebar.
  return (
    <div className="bg-white">
      <main>{children}</main>
    </div>
  );
}
