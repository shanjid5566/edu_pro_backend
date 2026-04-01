"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentNoticeController_js_1 = __importDefault(require("../controllers/studentNoticeController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require student or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("STUDENT", "ADMIN"));
/**
 * @route GET /student/notices
 * @description Get all notices with pagination
 * @access Private - Student/Admin
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/", studentNoticeController_js_1.default.getAllNotices);
/**
 * @route GET /student/notices/pinned
 * @description Get pinned notices only
 * @access Private - Student/Admin
 */
router.get("/pinned", studentNoticeController_js_1.default.getPinnedNotices);
/**
 * @route GET /student/notices/recent
 * @description Get recent notices
 * @access Private - Student/Admin
 * @query {number} limit - Number of records (default: 10)
 */
router.get("/recent", studentNoticeController_js_1.default.getRecentNotices);
/**
 * @route GET /student/notices/statistics
 * @description Get notices statistics
 * @access Private - Student/Admin
 */
router.get("/statistics", studentNoticeController_js_1.default.getStatistics);
/**
 * @route GET /student/notices/search
 * @description Search notices by keyword
 * @access Private - Student/Admin
 * @query {string} keyword - Search keyword (required)
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/search", studentNoticeController_js_1.default.searchNotices);
/**
 * @route GET /student/notices/category/:category
 * @description Get notices by category (General, Exam, Event, Holiday)
 * @access Private - Student/Admin
 * @param {string} category - Notice category
 * @query {number} limit - Number of records (default: 50)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/category/:category", studentNoticeController_js_1.default.getNoticesByCategory);
/**
 * @route GET /student/notices/:noticeId
 * @description Get notice details
 * @access Private - Student/Admin
 * @param {string} noticeId - Notice ID
 */
router.get("/:noticeId", studentNoticeController_js_1.default.getNoticeDetails);
exports.default = router;
