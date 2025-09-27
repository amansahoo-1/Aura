// backend/controllers/cartController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

const productSelectFields = {
  id: true,
  name: true,
  oneTimeRentalFee: true,
  imageUrls: true,
  description: true,
};

const calculateCartTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.oneTimeRentalFee * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return {
    subtotal,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

export const getCart = asyncHandler(async (req, res) => {
  // ✅ FIX: Get userId securely from the token
  const userId = req.user.id;

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: {
      items: {
        orderBy: { id: "asc" },
        include: { product: { select: productSelectFields } },
      },
    },
  });

  const totals = calculateCartTotals(cart.items);
  return successResponse(
    res,
    { ...cart, meta: totals },
    "Cart retrieved successfully"
  );
});

export const addCartItem = asyncHandler(async (req, res) => {
  // ✅ FIX: Get userId securely from the token
  const userId = req.user.id;
  const { productId, quantity } = req.body;

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

  // Using upsert on the CartItem is now possible because our final schema has the unique constraint
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
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
    "Item added to cart"
  );
});

export const removeCartItem = asyncHandler(async (req, res) => {
  // ✅ FIX: Get userId securely from the token
  const userId = req.user.id;
  const productId = parseInt(req.params.productId, 10);

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return errorResponse(res, "Cart not found", 404);
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId: productId },
  });

  return successResponse(res, null, "Item removed from cart");
});

export const clearCart = asyncHandler(async (req, res) => {
  // ✅ FIX: Get userId securely from the token
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return successResponse(res, null, "Cart cleared successfully");
});
