import { Router } from "express";
import studentNoticeController from "../controllers/studentNoticeController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require student or admin authentication
router.use(verifyToken, checkRole("STUDENT", "ADMIN"));

/**
 * @route GET /student/notices
 * @description Get all notices with pagination
 * @access Private - Student/Admin
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/", studentNoticeController.getAllNotices);

/**
 * @route GET /student/notices/pinned
 * @description Get pinned notices only
 * @access Private - Student/Admin
 */
router.get("/pinned", studentNoticeController.getPinnedNotices);

/**
 * @route GET /student/notices/recent
 * @description Get recent notices
 * @access Private - Student/Admin
 * @query {number} limit - Number of records (default: 10)
 */
router.get("/recent", studentNoticeController.getRecentNotices);

/**
 * @route GET /student/notices/statistics
 * @description Get notices statistics
 * @access Private - Student/Admin
 */
router.get("/statistics", studentNoticeController.getStatistics);

/**
 * @route GET /student/notices/search
 * @description Search notices by keyword
 * @access Private - Student/Admin
 * @query {string} keyword - Search keyword (required)
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/search", studentNoticeController.searchNotices);

/**
 * @route GET /student/notices/category/:category
 * @description Get notices by category (General, Exam, Event, Holiday)
 * @access Private - Student/Admin
 * @param {string} category - Notice category
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/category/:category", studentNoticeController.getNoticesByCategory);

/**
 * @route GET /student/notices/:noticeId
 * @description Get notice details
 * @access Private - Student/Admin
 * @param {string} noticeId - Notice ID
 */
router.get("/:noticeId", studentNoticeController.getNoticeDetails);

export default router;
