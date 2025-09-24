import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

if (!JWT_SECRET) {
  throw new Error(
    "❌ JWT_SECRET is not defined. Check your .env file or dotenv config."
  );
}

export const generateToken = (payload, expiresIn = JWT_EXPIRY) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
};

export const safeDecode = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const generateUserToken = (user) => {
  return generateToken({
    id: user.id,
    email: user.email,
    role: "USER", // Good practice to explicitly define role
  });
};

export const generateAdminToken = (admin) => {
  return generateToken({
    id: admin.id,
    role: admin.role, // e.g., 'ADMIN' or 'SUPERADMIN'
    email: admin.email,
  });
};

// ✨ NEW: Add the missing function for generating Seller tokens
export const generateSellerToken = (seller) => {
  return generateToken({
    id: seller.id,
    role: "SELLER", // This is crucial for your authorization middleware
    email: seller.email,
  });
};
