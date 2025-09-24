// backend/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

// --- Import all the new and correct routers ---
import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import rentalRouter from "./routes/rentalRoutes.js";
import subscriptionRouter from "./routes/subscriptionRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import kycRouter from "./routes/kycRouter.js";

// Config initialization
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

// --- Core Middleware Setup ---
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 150 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));

// --- Health Check Route ---
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// --- API Routes ---
// This section now correctly maps all our new modules to logical endpoints.
app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);
app.use("/api/sellers", sellerRouter);
app.use("/api/users", userRouter); // For user profile & address management
app.use("/api/products", productRouter); // Public-facing product discovery
app.use("/api/rentals", rentalRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/kyc", kycRouter);

// --- Error Handling Middleware (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
