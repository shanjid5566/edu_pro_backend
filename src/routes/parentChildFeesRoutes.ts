import { Router } from "express";
import parentChildFeesController from "../controllers/parentChildFeesController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require parent or admin authentication
router.use(verifyToken);
router.use(checkRole(["PARENT", "ADMIN"]));

/**
 * @route GET /parent/child-fees/:studentId
 * @description Get all fees for child with pagination
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/:studentId", parentChildFeesController.getAllFees);

/**
 * @route GET /parent/child-fees/:studentId/summary
 * @description Get fee summary (total paid, pending, overdue)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/summary", parentChildFeesController.getFeeSummary);

/**
 * @route GET /parent/child-fees/:studentId/by-type
 * @description Get fees breakdown by type
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/by-type", parentChildFeesController.getFeesByType);

/**
 * @route GET /parent/child-fees/:studentId/timeline
 * @description Get paid fees timeline (receipt history)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 10)
 */
router.get("/:studentId/timeline", parentChildFeesController.getFeesTimeline);

/**
 * @route GET /parent/child-fees/:studentId/upcoming
 * @description Get upcoming fees with days remaining
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/upcoming", parentChildFeesController.getUpcomingFees);

/**
 * @route GET /parent/child-fees/:studentId/overdue
 * @description Get overdue fees with days overdue
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/overdue", parentChildFeesController.getOverdueFees);

/**
 * @route GET /parent/child-fees/:studentId/:status
 * @description Get fees by status (PAID, UNPAID, PARTIAL)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @param {string} status - Fee status
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/:studentId/:status", parentChildFeesController.getFeesByStatus);

export default router;
