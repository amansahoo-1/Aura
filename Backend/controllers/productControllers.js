// backend/controllers/productController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

/**
 * @desc    Get all available products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  // Parse query parameters into numbers and provide defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { category, material, minFee, maxFee, sortBy } = req.query;
  const skip = (page - 1) * limit;

  // Build the dynamic 'where' clause for filtering
  const where = {
    isAvailable: true, // Only show products that are marked as available by the seller
    category: category || undefined,
    material: material || undefined,
    oneTimeRentalFee: {
      gte: minFee ? Number(minFee) : undefined,
      lte: maxFee ? Number(maxFee) : undefined,
    },
  };

  // Build the dynamic 'orderBy' clause for sorting
  const orderBy =
    sortBy === "fee_asc"
      ? { oneTimeRentalFee: "asc" }
      : sortBy === "fee_desc"
        ? { oneTimeRentalFee: "desc" }
        : { createdAt: "desc" }; // Default to 'newest'

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: skip, //for correctly passing a number
      take: limit, //for correctly passing a number
      orderBy,
      include: {
        seller: { select: { brandName: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return successResponse(
    res,
    {
      data: products,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    },
    "Products retrieved successfully"
  );
});

/**
 * @desc    Get a single product by its ID with full details
 * @route   GET /api/products/:productId
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: { select: { id: true, brandName: true } },
      reviews: {
        // Include user reviews for social proof
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
      _count: { select: { items: true } }, // Show how many physical items exist
    },
  });

  if (!product || !product.isAvailable) {
    return errorResponse(
      res,
      "Product not found or is currently unavailable",
      404
    );
  }
  return successResponse(res, product, "Product details retrieved");
});

/**
 * @desc    Search for products by a query string
 * @route   GET /api/products/search
 * @access  Public
 */
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const skip = (page - 1) * limit;

  const where = {
    isAvailable: true,
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { material: { contains: q, mode: "insensitive" } },
    ],
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { seller: { select: { brandName: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return successResponse(
    res,
    {
      data: products,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    },
    `Found ${total} products matching your search`
  );
});
