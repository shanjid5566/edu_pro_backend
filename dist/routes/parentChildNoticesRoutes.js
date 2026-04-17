"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parentChildNoticesController_js_1 = __importDefault(require("../controllers/parentChildNoticesController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require parent or admin authentication
router.use(authMiddleware_js_1.verifyToken);
router.use((0, authMiddleware_js_1.checkRole)(["PARENT", "ADMIN"]));
/**
 * @route GET /parent/child-notices/:studentId
 * @description Get all notices for child with pagination
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 20)
 * @query {number} offset - Pagination offset (default: 0)
 */
router.get("/:studentId", parentChildNoticesController_js_1.default.getAllNotices);
/**
 * @route GET /parent/child-notices/:studentId/pinned
 * @description Get pinned notices for child
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/pinned", parentChildNoticesController_js_1.default.getPinnedNotices);
/**
 * @route GET /parent/child-notices/:studentId/recent
 * @description Get recent notices (last N days)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} days - Number of days to look back (default: 7)
 */
router.get("/:studentId/recent", parentChildNoticesController_js_1.default.getRecentNotices);
/**
 * @route GET /parent/child-notices/:studentId/statistics
 * @description Get notice statistics by category
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/statistics", parentChildNoticesController_js_1.default.getNoticeStatistics);
/**
 * @route GET /parent/child-notices/:studentId/search
 * @description Search notices by title or description
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {string} query - Search query
 */
router.get("/:studentId/search", parentChildNoticesController_js_1.default.searchNotices);
/**
 * @route GET /parent/child-notices/:studentId/:noticeId
 * @description Get notice details
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @param {string} noticeId - Notice ID
 */
router.get("/:studentId/:noticeId", parentChildNoticesController_js_1.default.getNoticeDetails);
/**
 * @route GET /parent/child-notices/:studentId/category/:category
 * @description Get notices by category (GENERAL, EXAM, EVENT, HOLIDAY, IMPORTANT)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @param {string} category - Notice category
 */
router.get("/:studentId/category/:category", parentChildNoticesController_js_1.default.getNoticesByCategory);
exports.default = router;
