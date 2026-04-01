"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parentDashboardController_js_1 = __importDefault(require("../controllers/parentDashboardController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require parent or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("PARENT", "ADMIN"));
/**
 * @route GET /parent/dashboard
 * @description Get list of all children
 * @access Private - Parent/Admin
 */
router.get("/", parentDashboardController_js_1.default.getMyChildren);
/**
 * @route GET /parent/dashboard/:studentId/overview
 * @description Get child's dashboard overview (attendance, grades, rank, etc.)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/overview", parentDashboardController_js_1.default.getChildOverview);
/**
 * @route GET /parent/dashboard/:studentId/attendance-trend
 * @description Get child's attendance trend
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get("/:studentId/attendance-trend", parentDashboardController_js_1.default.getAttendanceTrend);
/**
 * @route GET /parent/dashboard/:studentId/recent-results
 * @description Get child's recent exam results
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 5)
 */
router.get("/:studentId/recent-results", parentDashboardController_js_1.default.getRecentResults);
/**
 * @route GET /parent/dashboard/:studentId/subject-performance
 * @description Get child's performance by subject
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/subject-performance", parentDashboardController_js_1.default.getSubjectPerformance);
/**
 * @route GET /parent/dashboard/:studentId/upcoming-events
 * @description Get child's upcoming exams and events
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 5)
 */
router.get("/:studentId/upcoming-events", parentDashboardController_js_1.default.getUpcomingEvents);
/**
 * @route GET /parent/dashboard/:studentId/notifications
 * @description Get school notifications for child
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 5)
 */
router.get("/:studentId/notifications", parentDashboardController_js_1.default.getNotifications);
exports.default = router;
