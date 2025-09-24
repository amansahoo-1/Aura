// backend/controllers/rentalController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";
import { RentalStatus, ItemStatus } from "@prisma/client/index.js";

// ✨ NEW: Initiates the checkout process, reserves items, and creates a pending rental.
export const initiateRental = asyncHandler(async (req, res) => {
  const { productIds, addressId } = req.body;
  const userId = req.user.id;

  // Verify the user is KYC verified before allowing a rental
  if (req.user.kycStatus !== "VERIFIED") {
    return errorResponse(
      res,
      "KYC verification is required to rent items.",
      403
    );
  }

  const rental = await prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address)
      throw new Error("Address not found or does not belong to user.");

    const availableItems = await findAvailableItemsForProducts(tx, productIds);
    const { fees, totalAmount } = await calculateRentalFees(availableItems);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Example: 30-day rental period

    const newRental = await tx.rental.create({
      data: {
        userId,
        shippingAddress: address, // Store the address object as JSON
        dueDate,
        status: RentalStatus.PENDING_PAYMENT,
        ...fees,
        items: {
          create: availableItems.map((item) => ({ itemId: item.id })),
        },
      },
    });

    await tx.item.updateMany({
      where: { id: { in: availableItems.map((item) => item.id) } },
      data: { status: ItemStatus.RESERVED },
    });

    return { ...newRental, totalAmountDue: totalAmount };
  });

  return successResponse(
    res,
    rental,
    "Rental initiated. Awaiting payment.",
    201
  );
});

// ✨ NEW: Confirms the rental after successful payment.
export const confirmRentalPayment = asyncHandler(async (req, res) => {
  const rentalId = parseInt(req.params.rentalId, 10);
  const userId = req.user.id;
  const { paymentGatewayId, paymentMethod } = req.body;

  const confirmedRental = await prisma.$transaction(async (tx) => {
    const rental = await tx.rental.findFirstOrThrow({
      where: { id: rentalId, userId, status: "PENDING_PAYMENT" },
      include: { items: true },
    });

    const totalAmount =
      rental.rentalFee + rental.securityDeposit + rental.damageWaiverFee;

    await tx.payment.create({
      data: {
        userId,
        rentalId,
        amount: totalAmount,
        paymentGatewayId,
        method: paymentMethod,
        status: "SUCCESS",
      },
    });

    const updatedRental = await tx.rental.update({
      where: { id: rentalId },
      data: { status: RentalStatus.CONFIRMED, totalPaid: totalAmount },
    });

    await tx.item.updateMany({
      where: { id: { in: rental.items.map((ri) => ri.itemId) } },
      data: { status: ItemStatus.RENTED },
    });

    await tx.cartItem.deleteMany({ where: { cart: { userId } } });
    return updatedRental;
  });

  return successResponse(
    res,
    confirmedRental,
    "Payment confirmed. Rental is active."
  );
});

// ✅ REFACTORED: Smartly updates both Rental and associated Item statuses.
export const updateRentalStatus = asyncHandler(async (req, res) => {
  const rentalId = parseInt(req.params.rentalId, 10);
  const { status } = req.body;

  const rental = await prisma.rental.findUniqueOrThrow({
    where: { id: rentalId },
    include: { items: true },
  });

  // A simple state machine to sync item status with rental status
  let newItemStatus = null;
  switch (status) {
    case RentalStatus.SHIPPED_TO_CUSTOMER:
      newItemStatus = ItemStatus.IN_TRANSIT_OUT;
      break;
    case RentalStatus.SHIPPED_TO_AURA:
      newItemStatus = ItemStatus.IN_TRANSIT_IN;
      break;
    case RentalStatus.RETURNED:
      newItemStatus = ItemStatus.IN_MAINTENANCE;
      break;
    case RentalStatus.COMPLETE:
      newItemStatus = ItemStatus.AVAILABLE;
      break;
  }

  const updatedRental = await prisma.rental.update({
    where: { id: rentalId },
    data: { status },
  });

  if (newItemStatus) {
    await prisma.item.updateMany({
      where: { id: { in: rental.items.map((ri) => ri.itemId) } },
      data: { status: newItemStatus },
    });
  }

  return successResponse(
    res,
    updatedRental,
    "Rental status updated successfully."
  );
});

// ✨ NEW: Endpoint for admins to add logistics information.
export const updateRentalLogistics = asyncHandler(async (req, res) => {
  const rentalId = parseInt(req.params.rentalId, 10);
  const logisticsData = req.body;
  const updatedRental = await prisma.rental.update({
    where: { id: rentalId },
    data: logisticsData,
  });
  return successResponse(res, updatedRental, "Rental logistics updated.");
});

// --- Helper Functions ---

async function findAvailableItemsForProducts(prisma, productIds) {
  const items = await Promise.all(
    productIds.map((pid) =>
      prisma.item.findFirst({
        where: { productId: pid, status: "AVAILABLE" },
        include: { product: true },
      })
    )
  );
  if (items.some((item) => !item))
    throw new Error("One or more products are unavailable for rent.");
  return items;
}

// ✅ REFACTORED: Calculates all fee components based on the new schema.
async function calculateRentalFees(items) {
  const fees = {
    rentalFee: items.reduce(
      (sum, item) => sum + item.product.oneTimeRentalFee,
      0
    ),
    securityDeposit: items.reduce(
      (sum, item) => sum + item.product.insuredDeclaredValue * 0.1,
      0
    ), // e.g., 10% of IDV
    damageWaiverFee: items.length * 500, // e.g., flat 500 per item
  };
  const totalAmount =
    fees.rentalFee + fees.securityDeposit + fees.damageWaiverFee;
  return { fees, totalAmount };
}
