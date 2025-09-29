// backend/controllers/dashboardController.js

import prisma from "../client/prismaClient.js";
import { Prisma } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

/**
 * @desc    Get key metrics for the entire platform (Admin/SuperAdmin)
 * @route   GET /api/dashboard/metrics
 * @access  Private/Admin
 */
export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const whereClause = {
    rentalDate: {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    },
  };

  const [rentalAggregate, userStats, sellerStats, operationalStats] =
    await Promise.all([
      // Aggregate rental financial data
      prisma.rental.aggregate({
        _count: { id: true },
        _sum: { totalPaid: true },
        where: whereClause,
      }),
      // User statistics including KYC status
      prisma.user.groupBy({
        by: ["kycStatus"],
        _count: { id: true },
      }),
      // Seller statistics including KYC status
      prisma.seller.groupBy({
        by: ["status", "kycStatus"],
        _count: { id: true },
      }),
      // Operational statistics for items
      prisma.item.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

  const metrics = {
    rentals: {
      total: rentalAggregate._count.id,
      revenue: rentalAggregate._sum.totalPaid || 0,
    },
    users: {
      total: userStats.reduce((sum, s) => sum + s._count.id, 0),
      kycPending:
        userStats.find((s) => s.kycStatus === "PENDING")?._count.id || 0,
    },
    sellers: {
      total: sellerStats.reduce((sum, s) => sum + s._count.id, 0),
      kycPending:
        sellerStats.find((s) => s.kycStatus === "PENDING")?._count.id || 0,
    },
    operations: {
      inMaintenance:
        operationalStats.find((s) => s.status === "IN_MAINTENANCE")?._count
          .id || 0,
    },
  };

  return successResponse(res, metrics, "Dashboard metrics retrieved");
});

/**
 * @desc    Get platform-wide rental analytics (Admin/SuperAdmin)
 * @route   GET /api/dashboard/analytics
 * @access  Private/Admin
 */
export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  // This function can be expanded with more complex analytics
  const topProducts = await prisma.product.findMany({
    orderBy: {
      items: { _count: "desc" },
    },
    take: 10,
    select: {
      id: true,
      name: true,
      _count: { select: { items: true } },
    },
  });

  const topSellers = await prisma.seller.findMany({
    orderBy: {
      products: {
        _count: "desc",
      },
    },
    take: 10,
    select: {
      id: true,
      brandName: true,
      _count: { select: { products: true } },
    },
  });

  const analytics = {
    topProducts: topProducts.map((p) => ({ ...p, itemCount: p._count.items })),
    topSellers: topSellers.map((s) => ({
      ...s,
      productCount: s._count.products,
    })),
  };
  return successResponse(res, analytics, "Platform analytics retrieved");
});

/**
 * NEW: Get dashboard metrics for a specific seller
 * @route   GET /api/dashboard/seller/metrics
 * @access  Private/Seller
 */
export const getSellerDashboardMetrics = asyncHandler(async (req, res) => {
  // Assuming sellerId is attached to req.user from auth middleware
  const sellerId = req.user.id;

  const [productStats, rentalStats, payoutStats] = await Promise.all([
    // Product and item stats for the seller
    prisma.product.aggregate({
      where: { sellerId },
      _count: { id: true },
    }),
    // Aggregate data from rentals involving this seller's products
    prisma.rental.aggregate({
      where: { items: { some: { item: { product: { sellerId } } } } },
      _sum: { totalPaid: true },
      _count: { id: true },
    }),
    // Payout stats for the seller
    prisma.payout.aggregate({
      where: { sellerId },
      _sum: { amount: true },
    }),
  ]);

  const sellerMetrics = {
    totalProducts: productStats._count.id,
    totalRentals: rentalStats._count.id,
    totalEarnings: rentalStats._sum.totalPaid || 0,
    totalPaidOut: payoutStats._sum.amount || 0,
  };

  return successResponse(res, sellerMetrics, "Seller metrics retrieved");
});

/**
 * @desc    Export data in various formats
 * @route   POST /api/dashboard/export
 * @access  Private/Admin
 */
export const exportData = asyncHandler(async (req, res) => {
  const { type, filters } = req.body;
  let data;

  switch (type) {
    case "rentals":
      data = await prisma.rental.findMany({
        include: { items: true, user: true, payments: true },
      });
      break;
    case "products":
      data = await prisma.product.findMany({
        where: { seller: { id: filters?.sellerId } },
      });
      break;
    case "users":
      data = await prisma.user.findMany({
        include: { rentals: true, addresses: true },
      });
      break;
    case "items":
      data = await prisma.item.findMany({ include: { product: true } });
      break;
    // NEW: Added seller and payout exports
    case "sellers":
      data = await prisma.seller.findMany({
        include: { products: true, payouts: true },
      });
      break;
    case "payouts":
      data = await prisma.payout.findMany({
        where: { sellerId: filters?.sellerId },
      });
      break;
    default:
      return errorResponse(res, "Invalid export type", 400);
  }

  // Placeholder for CSV/Excel generation. Returns JSON by default.
  return successResponse(res, data, "Data exported successfully");
});
