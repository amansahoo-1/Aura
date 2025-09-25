// Update as per backend API fields
export type Product = {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  arModelUrl?: string;
  category: string;
  material: string;
  oneTimeRentalFee: number;
  seller: { brandName: string };
};
