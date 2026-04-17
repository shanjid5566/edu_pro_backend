"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherDashboardController_js_1 = __importDefault(require("../controllers/teacherDashboardController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require teacher or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("TEACHER", "ADMIN"));
/**
 * @route GET /teacher/dashboard/overview
 * @description Get teacher dashboard overview statistics (my classes, total students, classes taken, avg performance)
 * @access Private - Teacher/Admin
 */
router.get("/overview", teacherDashboardController_js_1.default.getDashboardOverview);
/**
 * @route GET /teacher/dashboard/attendance-trend
 * @description Get class attendance trend data
 * @access Private - Teacher/Admin
 * @query {number} months - Number of months to fetch (default: 6)
 */
router.get("/attendance-trend", teacherDashboardController_js_1.default.getAttendanceTrend);
/**
 * @route GET /teacher/dashboard/student-performance
 * @description Get student performance by subject
 * @access Private - Teacher/Admin
 */
router.get("/student-performance", teacherDashboardController_js_1.default.getStudentPerformance);
/**
 * @route GET /teacher/dashboard/my-classes
 * @description Get teacher's classes (today and all)
 * @access Private - Teacher/Admin
 */
router.get("/my-classes", teacherDashboardController_js_1.default.getMyClasses);
/**
 * @route GET /teacher/dashboard/profile
 * @description Get teacher profile information
 * @access Private - Teacher/Admin
 */
router.get("/profile", teacherDashboardController_js_1.default.getTeacherProfile);
exports.default = router;
