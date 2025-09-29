// Enums from your Prisma Schema
export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  OPERATIONS = "OPERATIONS",
  SELLER = "SELLER",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum KycStatus {
  NOT_VERIFIED = "NOT_VERIFIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

// Model Types
export interface Address {
  id: number;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  userId: number;
}

export interface BaseUser {
  id: number;
  email: string;
  status: UserStatus;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseUser {
  name: string;
  phone?: string;
  addresses?: Address[];
  role: Role.USER;
}

export interface Seller extends BaseUser {
  brandName: string;
  contactPerson: string;
  phone?: string;
  address?: string;
  role: Role.SELLER;
}

export interface Admin extends BaseUser {
  name: string;
  role: Role.ADMIN | Role.SUPERADMIN | Role.OPERATIONS;
}

export type AuthenticatedUser = (User | Seller | Admin) & { role: Role };

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  token?: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
  seller?: Seller;
  admin?: Admin;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrls: string[];
  category: string;
  material: string;
  oneTimeRentalFee: number;
  insuredDeclaredValue: number;
  isAvailable: boolean;
  createdAt: string;
  seller: {
    brandName: string;
  };
}

export type NewProduct = {
  name: string;
  description: string;
  imageUrls: string[];
  category: string;
  material: string;
  oneTimeRentalFee: number;
  insuredDeclaredValue: number;
};

export interface AdminViewUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  kycStatus: KycStatus;
  createdAt: string;
}

export interface AdminViewSeller {
  id: number;
  brandName: string;
  email: string;
  status: UserStatus;
  kycStatus: KycStatus;
  createdAt: string;
}

// --- Cart Types ---
export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface CartMeta {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  meta: CartMeta;
}

// --- Wishlist Types ---
export interface WishlistItem {
  id: number;
  addedAt: string;
  product: Product;
}

export interface Wishlist {
  id: number;
  userId: number;
  items: WishlistItem[];
}

// --- Discount Types (for Admin) ---
export interface Discount {
  id: string;
  code: string;
  percentage: number;
  validTill: string;
}

// --- Review Types ---
export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    name: string;
  };
}

// --- Inquiry Types ---
export interface Inquiry {
  id: number;
  message: string;
  status: "PENDING" | "ASSIGNED" | "RESPONDED" | "RESOLVED";
  createdAt: string;
}

// --- KYC Types ---
// KycStatus enum is already defined from our previous work.

// --- Invoice Types ---
export interface Invoice {
  id: number;
  pdfUrl: string;
  totalAmount: number;
  createdAt: string;
  order: {
    // Assuming a rental is an order
    id: number;
    status: string;
  };
}

// --- Rental & Checkout Types ---
export interface Rental {
  id: number;
  status: string;
  rentalDate: string;
  dueDate: string;
  totalPaid: number;
  shippingAddress: Address;
  items: { product: Product }[];
}

export interface InitiatedRental {
  id: number;
  rentalFee: number;
  securityDeposit: number;
  damageWaiverFee: number;
  totalAmountDue: number;
}

// --- Subscription Types ---
export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  itemLimit: number;
  description?: string;
}

export interface UserSubscription {
  id: number;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  currentPeriodEndDate: string;
  plan: SubscriptionPlan;
}

export interface AdminViewUserDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  kycStatus: KycStatus;
  createdAt: string;
  _count: {
    rentals: number;
    addresses: number;
  };
}

export interface AdminViewSellerDetail {
  id: number;
  brandName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: UserStatus;
  kycStatus: KycStatus;
  createdAt: string;
  _count: {
    products: number;
  };
}

export interface UserRegistrationDetail {
  id: number;
  email: string;
  password: string;
  phone: string;
  initialAddress: string;
}

export interface SellerRegistrationDetail {
  id: number;
  brandName: string;
  contactPerson: string;
  email: string;
  password: string;
  phone: string;
}

export type SellerRegistrationPayload = {
  brandName: string;
  contactPerson: string;
  email: string;
  password: string;
  phone?: string;
};

export type UserRegistrationPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  initialAddress?: {
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
  };
};
