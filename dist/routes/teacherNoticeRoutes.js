"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherNoticeController_js_1 = __importDefault(require("../controllers/teacherNoticeController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require teacher or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("TEACHER", "ADMIN"));
/**
 * @route GET /teacher/notices
 * @description Get all notices with pagination
 * @access Private - Teacher/Admin
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Limit per page (default: 10, max: 100)
 * @query {string} category - Filter by category (optional)
 * @query {string} search - Search in title/message (optional)
 */
router.get("/", teacherNoticeController_js_1.default.getAllNotices);
/**
 * @route GET /teacher/notices/statistics
 * @description Get notice statistics
 * @access Private - Teacher/Admin
 */
router.get("/statistics", teacherNoticeController_js_1.default.getStatistics);
/**
 * @route GET /teacher/notices/pinned
 * @description Get pinned notices
 * @access Private - Teacher/Admin
 */
router.get("/pinned", teacherNoticeController_js_1.default.getPinnedNotices);
/**
 * @route GET /teacher/notices/recent
 * @description Get recent notices
 * @access Private - Teacher/Admin
 * @query {number} limit - Number of recent notices (default: 10, max: 100)
 */
router.get("/recent", teacherNoticeController_js_1.default.getRecentNotices);
/**
 * @route GET /teacher/notices/category/:category
 * @description Get notices by category
 * @access Private - Teacher/Admin
 * @param {string} category - Category (general, exam, event, holiday)
 */
router.get("/category/:category", teacherNoticeController_js_1.default.getNoticesByCategory);
/**
 * @route GET /teacher/notices/search
 * @description Search notices
 * @access Private - Teacher/Admin
 * @query {string} query - Search query
 */
router.get("/search", teacherNoticeController_js_1.default.searchNotices);
/**
 * @route GET /teacher/notices/:noticeId
 * @description Get notice by ID
 * @access Private - Teacher/Admin
 * @param {string} noticeId - Notice ID
 */
router.get("/:noticeId", teacherNoticeController_js_1.default.getNoticeById);
exports.default = router;
