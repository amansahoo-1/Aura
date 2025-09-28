// backend/controllers/authController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import {
  generateUserToken,
  generateSellerToken,
  generateAdminToken,
} from "../utils/jwt.js";

// --- Registration Logic ---

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, initialAddress } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return errorResponse(res, "Email already in use", 409);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      cart: { create: {} },
      wishlist: { create: {} },
      addresses: initialAddress
        ? {
            create: [{ ...initialAddress, isDefault: true }],
          }
        : undefined,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return successResponse(res, newUser, "User registered successfully", 201);
});

export const registerSeller = asyncHandler(async (req, res) => {
  const { brandName, contactPerson, email, password, phone } = req.body;
  const existingSeller = await prisma.seller.findUnique({ where: { email } });
  if (existingSeller) {
    return errorResponse(res, "Email already in use", 409);
  }

  const hashedPassword = await hashPassword(password);
  const newSeller = await prisma.seller.create({
    data: { brandName, contactPerson, email, password: hashedPassword, phone },
  });

  const { password: _, ...sellerData } = newSeller;
  return successResponse(
    res,
    sellerData,
    "Seller registered successfully. Awaiting KYC.",
    201
  );
});

// --- Login Logic ---

const login = async (req, res, modelName, tokenGenerator) => {
  const { email, password } = req.body;

  let entity;
  if (modelName === "admin") {
    entity = await prisma.admin.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });
  } else {
    entity = await prisma[modelName].findUnique({ where: { email } });
  }

  if (!entity) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  if (
    (modelName === "user" || modelName === "seller") &&
    entity.status !== "ACTIVE"
  ) {
    return errorResponse(
      res,
      `Account is not active. Current status: ${entity.status}`,
      403
    );
  }

  const isMatch = await comparePassword(password, entity.password);
  if (!isMatch) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const token = tokenGenerator({
    id: entity.id,
    role: entity.role || modelName.toUpperCase(),
  });
  const { password: _, ...entityData } = entity;
  return successResponse(res, { token, [modelName]: entityData });
};

export const loginUser = asyncHandler((req, res) =>
  login(req, res, "user", generateUserToken)
);
export const loginSeller = asyncHandler((req, res) =>
  login(req, res, "seller", generateSellerToken)
);
export const loginAdmin = asyncHandler((req, res) =>
  login(req, res, "admin", generateAdminToken)
);
