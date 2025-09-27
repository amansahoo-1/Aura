// backend/middleware/authMiddleware.js

import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

/**
 * Attaches the authenticated entity (user, seller, or admin) to the request object.
 */
export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    // No token provided, proceed to see if it's a public route.
    return next();
  }

  try {
    const decoded = verifyToken(token); // e.g., { id: 1, role: 'SELLER' }
    let entity = null;

    // ✨ FIX: Added specific logic to handle the 'SELLER' role.
    if (decoded.role === "USER") {
      entity = await prisma.user.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === "SELLER") {
      entity = await prisma.seller.findUnique({ where: { id: decoded.id } });
    } else if (["ADMIN", "SUPERADMIN", "OPERATIONS"].includes(decoded.role)) {
      entity = await prisma.admin.findUnique({ where: { id: decoded.id } });
    }

    if (!entity) {
      // The user ID/role in the token does not exist in the database.
      return res.status(401).json({ message: "User not found." });
    }

    // Attach the full user/seller/admin object to the request.
    req.user = entity;

    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};

/**
 * Ensures a user is authenticated before proceeding.
 */
export const requireAuth = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };
};

/**
 * Checks if the authenticated user has one of the specified roles.
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have the required role." });
    }
    next();
  };
};

/**
 * Enforces account status for Users and Sellers.
 */
export const checkAccountStatus = async (req, res, next) => {
  // This middleware is for Users and Sellers, who have a status field.
  if (!req.user || !req.user.status) {
    return next();
  }

  if (req.user.status === "SUSPENDED") {
    return res
      .status(403)
      .json({ message: "Your account has been suspended." });
  }

  if (req.user.status === "DELETED") {
    return res.status(403).json({ message: "Your account has been deleted." });
  }

  next();
};
