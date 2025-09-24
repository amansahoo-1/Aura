// backend/controllers/cartController.js
import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

// ✅ FIX: Using the correct field 'oneTimeRentalFee' from the Product schema
const productSelectFields = {
  id: true,
  name: true,
  oneTimeRentalFee: true, // Switched from 'price'
  imageUrl: true,
  description: true,
};

/**
 * Calculate cart totals.
 */
const calculateCartTotals = (items) => {
  // ✅ FIX: Calculation now uses oneTimeRentalFee
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.oneTimeRentalFee * item.quantity,
    0
  );

  // Note: Tax and total calculations are kept as per original business logic
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

/**
 * Get or create user's cart.
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: {
      items: {
        orderBy: { id: "asc" },
        include: { product: { select: productSelectFields } },
      },
      // ❌ REMOVED: Cannot include discount as Cart has no relation to it.
    },
  });

  const totals = calculateCartTotals(cart.items);

  return successResponse(
    res,
    {
      ...cart,
      meta: totals,
    },
    "Cart retrieved successfully"
  );
});

/**
 * Replace entire cart contents.
 */
export const updateCart = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { items } = req.body; // Assuming validated by middleware

  const productIds = items.map((item) => item.productId);
  const productCount = await prisma.product.count({
    where: { id: { in: productIds } },
  });

  if (productCount !== productIds.length) {
    return errorResponse(res, "One or more products not found", 404);
  }

  const cartData = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (items.length > 0) {
      await tx.cartItem.createMany({
        data: items.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return await tx.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: { include: { product: { select: productSelectFields } } },
      },
    });
  });

  const totals = calculateCartTotals(cartData.items);
  return successResponse(res, { ...cartData, meta: totals }, "Cart updated");
});

/**
 * Add an item to the cart or update its quantity.
 */
export const addCartItem = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { productId, quantity } = req.body; // Assuming validated

  const productExists = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!productExists) {
    return errorResponse(res, "Product not found", 404);
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  // ✅ FIX: Rewritten logic to avoid using a non-existent unique key
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: productId },
  });

  if (existingItem) {
    // If item exists, update its quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } },
    });
  } else {
    // If item does not exist, create it
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: { include: { product: { select: productSelectFields } } },
    },
  });

  const totals = calculateCartTotals(updatedCart.items);
  return successResponse(
    res,
    { ...updatedCart, meta: totals },
    "Item added to cart"
  );
});

/**
 * Remove an item from the cart.
 */
export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return errorResponse(res, "Cart not found", 404);
  }

  // ✅ FIX: Delete based on the found cartId and productId, not a composite key
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId: productId,
    },
  });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: { include: { product: { select: productSelectFields } } },
    },
  });

  const totals = calculateCartTotals(updatedCart.items);
  return successResponse(
    res,
    { ...updatedCart, meta: totals },
    "Item removed from cart"
  );
});

/**
 * Clear all items from a user's cart.
 */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);

  const cart = await prisma.cart.findUnique({ where: { userId } });

  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return successResponse(res, null, "Cart cleared successfully");
});

/**
 * Get the total number of items in the cart.
 */
export const getCartItemCount = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { _count: { select: { items: true } } },
  });

  return successResponse(
    res,
    { itemCount: cart?._count.items || 0 },
    "Cart item count retrieved"
  );
});
