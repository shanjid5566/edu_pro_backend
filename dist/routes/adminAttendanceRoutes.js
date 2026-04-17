"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAttendanceController_1 = __importDefault(require("../controllers/adminAttendanceController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]));
/**
 * @route   GET /admin/attendance/statistics/today
 * @desc    Get today's attendance statistics
 * @access  Admin
 */
router.get("/statistics/today", adminAttendanceController_1.default.getTodayStatistics);
/**
 * @route   GET /admin/attendance/overview/today
 * @desc    Get today's attendance overview with statistics and class-wise data
 * @access  Admin
 */
router.get("/overview/today", adminAttendanceController_1.default.getTodayOverview);
/**
 * @route   GET /admin/attendance/classwise
 * @desc    Get class-wise attendance for a specific date
 * @query   date (optional, default: today)
 * @access  Admin
 */
router.get("/classwise", adminAttendanceController_1.default.getClasswiseAttendance);
/**
 * @route   GET /admin/attendance/student/:studentId
 * @desc    Get student attendance history
 * @query   limit (optional, default: 30)
 * @access  Admin
 */
router.get("/student/:studentId", adminAttendanceController_1.default.getStudentAttendanceHistory);
/**
 * @route   GET /admin/attendance/range
 * @desc    Get attendance by date range
 * @query   startDate, endDate, classId (optional)
 * @access  Admin
 */
router.get("/range", adminAttendanceController_1.default.getAttendanceByDateRange);
/**
 * @route   GET /admin/attendance/report/class/:classId
 * @desc    Get attendance report by class
 * @query   startDate, endDate
 * @access  Admin
 */
router.get("/report/class/:classId", adminAttendanceController_1.default.getAttendanceReportByClass);
/**
 * @route   GET /admin/attendance/export/csv
 * @desc    Export attendance to CSV
 * @query   startDate, endDate, classId (optional)
 * @access  Admin
 */
router.get("/export/csv", adminAttendanceController_1.default.exportAttendanceToCSV);
/**
 * @route   GET /admin/attendance
 * @desc    Get all attendance records
 * @query   page, limit, classId, status
 * @access  Admin
 */
router.get("/", adminAttendanceController_1.default.getAllAttendance);
/**
 * @route   POST /admin/attendance/mark
 * @desc    Mark attendance for students in a class
 * @body    { classId, date, attendanceData: [{studentId, status}] }
 * @access  Admin
 */
router.post("/mark", adminAttendanceController_1.default.markAttendance);
/**
 * @route   GET /admin/attendance/:attendanceId
 * @desc    Get attendance record by ID
 * @access  Admin
 */
router.get("/:attendanceId", adminAttendanceController_1.default.getAttendanceById);
/**
 * @route   PUT /admin/attendance/:attendanceId
 * @desc    Update attendance record
 * @body    { status: "PRESENT" | "ABSENT" | "LATE" }
 * @access  Admin
 */
router.put("/:attendanceId", adminAttendanceController_1.default.updateAttendance);
/**
 * @route   DELETE /admin/attendance/:attendanceId
 * @desc    Delete attendance record
 * @access  Admin
 */
router.delete("/:attendanceId", adminAttendanceController_1.default.deleteAttendance);
exports.default = router;
