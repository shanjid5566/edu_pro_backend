import { Router } from "express";
import studentFeesController from "../controllers/studentFeesController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require student or admin authentication
router.use(verifyToken, checkRole("STUDENT", "ADMIN"));

/**
 * @route GET /student/fees
 * @description Get all fees with status
 * @access Private - Student/Admin
 */
router.get("/", studentFeesController.getAllFees);

/**
 * @route GET /student/fees/summary
 * @description Get fee summary (total paid, pending, overdue)
 * @access Private - Student/Admin
 */
router.get("/summary", studentFeesController.getFeeSummary);

/**
 * @route GET /student/fees/by-type
 * @description Get fees breakdown by type
 * @access Private - Student/Admin
 */
router.get("/by-type", studentFeesController.getFeesByType);

/**
 * @route GET /student/fees/timeline
 * @description Get paid fees timeline (receipt history)
 * @access Private - Student/Admin
 * @query {number} limit - Number of records to return (default: 10)
 */
router.get("/timeline", studentFeesController.getFeeTimeline);

/**
 * @route GET /student/fees/upcoming
 * @description Get upcoming fees with days remaining
 * @access Private - Student/Admin
 */
router.get("/upcoming", studentFeesController.getUpcomingFees);

/**
 * @route GET /student/fees/overdue
 * @description Get overdue fees with days overdue
 * @access Private - Student/Admin
 */
router.get("/overdue", studentFeesController.getOverdueFees);

/**
 * @route GET /student/fees/status/:status
 * @description Get fees by status (PAID, PENDING, OVERDUE)
 * @access Private - Student/Admin
 * @param {string} status - Fee status
 */
router.get("/status/:status", studentFeesController.getFeesByStatus);

export default router;
