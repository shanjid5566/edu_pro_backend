import { Router } from "express";
import parentDashboardController from "../controllers/parentDashboardController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require parent or admin authentication
router.use(verifyToken, checkRole("PARENT", "ADMIN"));

/**
 * @route GET /parent/dashboard
 * @description Get list of all children
 * @access Private - Parent/Admin
 */
router.get("/", parentDashboardController.getMyChildren);

/**
 * @route GET /parent/dashboard/:studentId/overview
 * @description Get child's dashboard overview (attendance, grades, rank, etc.)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/overview", parentDashboardController.getChildOverview);

/**
 * @route GET /parent/dashboard/:studentId/attendance-trend
 * @description Get child's attendance trend
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get(
  "/:studentId/attendance-trend",
  parentDashboardController.getAttendanceTrend
);

/**
 * @route GET /parent/dashboard/:studentId/recent-results
 * @description Get child's recent exam results
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 5)
 */
router.get(
  "/:studentId/recent-results",
  parentDashboardController.getRecentResults
);

/**
 * @route GET /parent/dashboard/:studentId/subject-performance
 * @description Get child's performance by subject
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get(
  "/:studentId/subject-performance",
  parentDashboardController.getSubjectPerformance
);

/**
 * @route GET /parent/dashboard/:studentId/upcoming-events
 * @description Get child's upcoming exams and events
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 5)
 */
router.get(
  "/:studentId/upcoming-events",
  parentDashboardController.getUpcomingEvents
);

/**
 * @route GET /parent/dashboard/:studentId/notifications
 * @description Get school notifications for child
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 5)
 */
router.get(
  "/:studentId/notifications",
  parentDashboardController.getNotifications
);

export default router;
