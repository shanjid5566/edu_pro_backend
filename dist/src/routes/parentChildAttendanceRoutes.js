"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parentChildAttendanceController_js_1 = __importDefault(require("../controllers/parentChildAttendanceController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require parent or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("PARENT", "ADMIN"));
/**
 * @route GET /parent/child-attendance/:studentId/summary
 * @description Get child's attendance summary (present, absent, late, percentage)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/summary", parentChildAttendanceController_js_1.default.getAttendanceSummary);
/**
 * @route GET /parent/child-attendance/:studentId/trend
 * @description Get child's attendance trend over time (monthly data)
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} months - Number of months to look back (default: 6)
 */
router.get("/:studentId/trend", parentChildAttendanceController_js_1.default.getAttendanceTrend);
/**
 * @route GET /parent/child-attendance/:studentId/recent
 * @description Get child's recent attendance records
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {number} limit - Number of records (default: 10)
 */
router.get("/:studentId/recent", parentChildAttendanceController_js_1.default.getRecentAttendance);
/**
 * @route GET /parent/child-attendance/:studentId/statistics
 * @description Get child's attendance statistics
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 */
router.get("/:studentId/statistics", parentChildAttendanceController_js_1.default.getAttendanceStatistics);
/**
 * @route GET /parent/child-attendance/:studentId/range
 * @description Get child's attendance for a date range
 * @access Private - Parent/Admin
 * @param {string} studentId - Student ID
 * @query {string} startDate - Start date (YYYY-MM-DD) (required)
 * @query {string} endDate - End date (YYYY-MM-DD) (required)
 */
router.get("/:studentId/range", parentChildAttendanceController_js_1.default.getAttendanceByDateRange);
exports.default = router;
