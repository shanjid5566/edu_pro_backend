import { Router } from "express";
import parentChildAttendanceController from "../controllers/parentChildAttendanceController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require parent or admin authentication
router.use(verifyToken, checkRole("PARENT", "ADMIN"));

/**
 * @route GET /parent/child-attendance/:studentId/summary
 * @description Get child's attendance summary (present, absent, late, percentage)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get(
  "/:studentId/summary",
  parentChildAttendanceController.getAttendanceSummary
);

/**
 * @route GET /parent/child-attendance/:studentId/trend
 * @description Get child's attendance trend over time (monthly data)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get(
  "/:studentId/trend",
  parentChildAttendanceController.getAttendanceTrend
);

/**
 * @route GET /parent/child-attendance/:studentId/recent
 * @description Get child's recent attendance records
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 10)
 */
router.get(
  "/:studentId/recent",
  parentChildAttendanceController.getRecentAttendance
);

/**
 * @route GET /parent/child-attendance/:studentId/statistics
 * @description Get child's attendance statistics
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get(
  "/:studentId/statistics",
  parentChildAttendanceController.getAttendanceStatistics
);

/**
 * @route GET /parent/child-attendance/:studentId/range
 * @description Get child's attendance for a date range
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {string} startDate - Start date (YYYY-MM-DD) (required)
 * @query {string} endDate - End date (YYYY-MM-DD) (required)
 */
router.get(
  "/:studentId/range",
  parentChildAttendanceController.getAttendanceByDateRange
);

export default router;
