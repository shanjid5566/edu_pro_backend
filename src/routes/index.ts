import { Router } from "express";
import authRoutes from "./authRoutes";
import adminDashboardRoutes from "./adminDashboardRoutes";
import adminStudentRoutes from "./adminStudentRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Admin Dashboard routes
router.use("/admin/dashboard", adminDashboardRoutes);

// Admin Student routes
router.use("/admin/students", adminStudentRoutes);

export default router;
