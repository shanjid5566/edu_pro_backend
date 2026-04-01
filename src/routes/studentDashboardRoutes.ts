import { Router } from "express";
import studentDashboardController from "../controllers/studentDashboardController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require student or admin authentication
router.use(verifyToken, checkRole("STUDENT", "ADMIN"));

/**
 * @route GET /student/dashboard/overview
 * @description Get student dashboard overview (subjects, attendance, grade, rank)
 * @access Private - Student/Admin
 */
router.get(
  "/overview",
  studentDashboardController.getDashboardOverview
);

/**
 * @route GET /student/dashboard/attendance-trend
 * @description Get attendance trend chart data
 * @access Private - Student/Admin
 * @query {number} months - Number of months to fetch (default: 6)
 */
router.get(
  "/attendance-trend",
  studentDashboardController.getAttendanceTrend
);

/**
 * @route GET /student/dashboard/subject-performance
 * @description Get subject performance chart data
 * @access Private - Student/Admin
 */
router.get(
  "/subject-performance",
  studentDashboardController.getSubjectPerformance
);

/**
 * @route GET /student/dashboard/my-class
 * @description Get student's class information
 * @access Private - Student/Admin
 */
router.get(
  "/my-class",
  studentDashboardController.getMyClasses
);

/**
 * @route GET /student/dashboard/recent-results
 * @description Get recent exam results
 * @access Private - Student/Admin
 * @query {number} limit - Number of results to fetch (default: 5)
 */
router.get(
  "/recent-results",
  studentDashboardController.getRecentResults
);

export default router;
