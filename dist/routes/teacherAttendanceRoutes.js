"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherAttendanceController_js_1 = __importDefault(require("../controllers/teacherAttendanceController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// All routes require teacher or admin authentication
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("TEACHER", "ADMIN"));
/**
 * @route GET /teacher/attendance/:classId/students
 * @description Get students in a class for attendance marking
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/:classId/students", teacherAttendanceController_js_1.default.getClassStudents);
/**
 * @route POST /teacher/attendance/:classId/mark
 * @description Mark attendance for a class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 * @body {Array} attendanceData - Array of {studentId, status}
 * @body {string} date - Attendance date (YYYY-MM-DD)
 */
router.post("/:classId/mark", teacherAttendanceController_js_1.default.markAttendance);
/**
 * @route GET /teacher/attendance/:classId/records
 * @description Get attendance records for a class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 * @query {string} startDate - Start date (optional, YYYY-MM-DD)
 * @query {string} endDate - End date (optional, YYYY-MM-DD)
 */
router.get("/:classId/records", teacherAttendanceController_js_1.default.getAttendanceRecords);
/**
 * @route GET /teacher/attendance/:classId/student/:studentId
 * @description Get attendance summary for a student
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 * @param {string} studentId - Student ID
 */
router.get("/:classId/student/:studentId", teacherAttendanceController_js_1.default.getStudentSummary);
exports.default = router;
