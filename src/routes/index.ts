import { Router } from "express";
import authRoutes from "./authRoutes";
import adminDashboardRoutes from "./adminDashboardRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Admin Dashboard routes
router.use("/admin/dashboard", adminDashboardRoutes);

export default router;
