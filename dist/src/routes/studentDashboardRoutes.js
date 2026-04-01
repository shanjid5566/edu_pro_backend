"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentDashboardController_js_1 = __importDefault(require("../controllers/studentDashboardController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require student or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("STUDENT", "ADMIN"));
/**
 * @route GET /student/dashboard/overview
 * @description Get student dashboard overview (subjects, attendance, grade, rank)
 * @access Private - Student/Admin
 */
router.get("/overview", studentDashboardController_js_1.default.getDashboardOverview);
/**
 * @route GET /student/dashboard/attendance-trend
 * @description Get attendance trend chart data
 * @access Private - Student/Admin
 * @query {number} months - Number of months to fetch (default: 6)
 */
router.get("/attendance-trend", studentDashboardController_js_1.default.getAttendanceTrend);
/**
 * @route GET /student/dashboard/subject-performance
 * @description Get subject performance chart data
 * @access Private - Student/Admin
 */
router.get("/subject-performance", studentDashboardController_js_1.default.getSubjectPerformance);
/**
 * @route GET /student/dashboard/my-class
 * @description Get student's class information
 * @access Private - Student/Admin
 */
router.get("/my-class", studentDashboardController_js_1.default.getMyClasses);
/**
 * @route GET /student/dashboard/recent-results
 * @description Get recent exam results
 * @access Private - Student/Admin
 * @query {number} limit - Number of results to fetch (default: 5)
 */
router.get("/recent-results", studentDashboardController_js_1.default.getRecentResults);
exports.default = router;
