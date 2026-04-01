import { Router } from "express";
import studentResultsController from "../controllers/studentResultsController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require student or admin authentication
router.use(verifyToken, checkRole("STUDENT", "ADMIN"));

/**
 * @route GET /student/results
 * @description Get all exam results
 * @access Private - Student/Admin
 */
router.get("/", studentResultsController.getAllResults);

/**
 * @route GET /student/results/summary
 * @description Get results summary (totals, averages, highs/lows)
 * @access Private - Student/Admin
 */
router.get("/summary", studentResultsController.getResultsSummary);

/**
 * @route GET /student/results/subject-performance
 * @description Get performance breakdown by subject
 * @access Private - Student/Admin
 */
router.get("/subject-performance", studentResultsController.getSubjectPerformance);

/**
 * @route GET /student/results/class-comparison
 * @description Get comparison with class average and ranking
 * @access Private - Student/Admin
 */
router.get("/class-comparison", studentResultsController.getClassComparison);

/**
 * @route GET /student/results/trend
 * @description Get performance trend over time
 * @access Private - Student/Admin
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get("/trend", studentResultsController.getPerformanceTrend);

/**
 * @route GET /student/results/subject/:subjectId
 * @description Get all results for a specific subject
 * @access Private - Student/Admin
 * @param {string} subjectId - Subject ID
 */
router.get("/subject/:subjectId", studentResultsController.getResultsBySubject);

export default router;
