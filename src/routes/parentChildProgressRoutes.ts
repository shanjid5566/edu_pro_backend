import { Router } from "express";
import parentChildProgressController from "../controllers/parentChildProgressController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require parent or admin authentication
router.use(verifyToken, checkRole("PARENT", "ADMIN"));

/**
 * @route GET /parent/child-progress/:studentId/metrics
 * @description Get child's progress metrics (grade, rank, attendance, avg score)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/metrics", parentChildProgressController.getProgressMetrics);

/**
 * @route GET /parent/child-progress/:studentId/timeline
 * @description Get child's progress over time (monthly grades)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get(
  "/:studentId/timeline",
  parentChildProgressController.getProgressOverTime
);

/**
 * @route GET /parent/child-progress/:studentId/subjects
 * @description Get child's subject-wise performance
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get(
  "/:studentId/subjects",
  parentChildProgressController.getSubjectWisePerformance
);

/**
 * @route GET /parent/child-progress/:studentId/exam-results
 * @description Get child's exam results with trend analysis
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 10)
 */
router.get(
  "/:studentId/exam-results",
  parentChildProgressController.getExamResultsWithTrends
);

/**
 * @route GET /parent/child-progress/:studentId/summary
 * @description Get child's performance summary and statistics
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get(
  "/:studentId/summary",
  parentChildProgressController.getPerformanceSummary
);

export default router;
