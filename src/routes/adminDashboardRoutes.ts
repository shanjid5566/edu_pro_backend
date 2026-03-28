import { Router } from "express";
import adminDashboardController from "../controllers/adminDashboardController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Get complete dashboard
router.get(
  "/",
  verifyToken,
  checkRole(["ADMIN"]),
  adminDashboardController.getDashboard
);

// Get overall statistics
router.get(
  "/stats",
  verifyToken,
  checkRole(["ADMIN"]),
  adminDashboardController.getStats
);

// Get attendance trend
router.get(
  "/attendance-trend",
  verifyToken,
  checkRole(["ADMIN"]),
  adminDashboardController.getAttendanceTrend
);

// Get performance by subject
router.get(
  "/performance",
  verifyToken,
  checkRole(["ADMIN"]),
  adminDashboardController.getPerformance
);

// Get today's attendance
router.get(
  "/today-attendance",
  verifyToken,
  checkRole(["ADMIN"]),
  adminDashboardController.getTodayAttendance
);

// Get recent activity
router.get(
  "/recent-activity",
  verifyToken,
  checkRole(["ADMIN"]),
  adminDashboardController.getRecentActivity
);

export default router;
