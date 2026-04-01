import { Router } from "express";
import teacherNoticeController from "../controllers/teacherNoticeController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require teacher or admin authentication
router.use(verifyToken, checkRole("TEACHER", "ADMIN"));

/**
 * @route GET /teacher/notices
 * @description Get all notices with pagination
 * @access Private - Teacher/Admin
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Limit per page (default: 10, max: 100)
 * @query {string} category - Filter by category (optional)
 * @query {string} search - Search in title/message (optional)
 */
router.get("/", teacherNoticeController.getAllNotices);

/**
 * @route GET /teacher/notices/statistics
 * @description Get notice statistics
 * @access Private - Teacher/Admin
 */
router.get("/statistics", teacherNoticeController.getStatistics);

/**
 * @route GET /teacher/notices/pinned
 * @description Get pinned notices
 * @access Private - Teacher/Admin
 */
router.get("/pinned", teacherNoticeController.getPinnedNotices);

/**
 * @route GET /teacher/notices/recent
 * @description Get recent notices
 * @access Private - Teacher/Admin
 * @query {number} limit - Number of recent notices (default: 10, max: 100)
 */
router.get("/recent", teacherNoticeController.getRecentNotices);

/**
 * @route GET /teacher/notices/category/:category
 * @description Get notices by category
 * @access Private - Teacher/Admin
 * @param {string} category - Category (general, exam, event, holiday)
 */
router.get("/category/:category", teacherNoticeController.getNoticesByCategory);

/**
 * @route GET /teacher/notices/search
 * @description Search notices
 * @access Private - Teacher/Admin
 * @query {string} query - Search query
 */
router.get("/search", teacherNoticeController.searchNotices);

/**
 * @route GET /teacher/notices/:noticeId
 * @description Get notice by ID
 * @access Private - Teacher/Admin
 * @param {string} noticeId - Notice ID
 */
router.get("/:noticeId", teacherNoticeController.getNoticeById);

export default router;
