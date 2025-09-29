// backend/routes/initRoutes.js
import express from "express";
import { bootstrapSuperAdmin } from "../utils/init_admin.js";

const Initrouter = express.Router();

// Protect this in production!
Initrouter.post("/init-superadmin", bootstrapSuperAdmin); // Protect this in production!

export default Initrouter;
