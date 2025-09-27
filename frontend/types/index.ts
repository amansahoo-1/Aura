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
