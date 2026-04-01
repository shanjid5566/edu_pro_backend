import { Router } from "express";
import parentChildNoticesController from "../controllers/parentChildNoticesController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require parent or admin authentication
router.use(verifyToken);
router.use(checkRole(["PARENT", "ADMIN"]));

/**
 * @route GET /parent/child-notices/:studentId
 * @description Get all notices for child with pagination
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 20)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/:studentId", parentChildNoticesController.getAllNotices);

/**
 * @route GET /parent/child-notices/:studentId/pinned
 * @description Get pinned notices for child
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/pinned", parentChildNoticesController.getPinnedNotices);

/**
 * @route GET /parent/child-notices/:studentId/recent
 * @description Get recent notices (last N days)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} days - Number of days to look back (default: 7)
 */
router.get("/:studentId/recent", parentChildNoticesController.getRecentNotices);

/**
 * @route GET /parent/child-notices/:studentId/statistics
 * @description Get notice statistics by category
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/statistics", parentChildNoticesController.getNoticeStatistics);

/**
 * @route GET /parent/child-notices/:studentId/search
 * @description Search notices by title or description
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {string} query - Search query
 */
router.get("/:studentId/search", parentChildNoticesController.searchNotices);

/**
 * @route GET /parent/child-notices/:studentId/:noticeId
 * @description Get notice details
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @param {string} noticeId - Notice ID
 */
router.get("/:studentId/:noticeId", parentChildNoticesController.getNoticeDetails);

/**
 * @route GET /parent/child-notices/:studentId/category/:category
 * @description Get notices by category (GENERAL, EXAM, EVENT, HOLIDAY, IMPORTANT)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @param {string} category - Notice category
 */
router.get("/:studentId/category/:category", parentChildNoticesController.getNoticesByCategory);

export default router;
