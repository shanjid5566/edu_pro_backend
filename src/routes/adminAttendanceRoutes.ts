import { Router } from "express";
import adminAttendanceController from "../controllers/adminAttendanceController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken, checkRole(["ADMIN"]));

/**
 * @route   GET /admin/attendance/statistics/today
 * @desc    Get today's attendance statistics
 * @access  Admin
 */
router.get("/statistics/today", adminAttendanceController.getTodayStatistics);

/**
 * @route   GET /admin/attendance/overview/today
 * @desc    Get today's attendance overview with statistics and class-wise data
 * @access  Admin
 */
router.get("/overview/today", adminAttendanceController.getTodayOverview);

/**
 * @route   GET /admin/attendance/classwise
 * @desc    Get class-wise attendance for a specific date
 * @query   date (optional, default: today)
 * @access  Admin
 */
router.get("/classwise", adminAttendanceController.getClasswiseAttendance);

/**
 * @route   GET /admin/attendance/student/:studentId
 * @desc    Get student attendance history
 * @query   limit (optional, default: 30)
 * @access  Admin
 */
router.get(
  "/student/:studentId",
  adminAttendanceController.getStudentAttendanceHistory
);

/**
 * @route   GET /admin/attendance/range
 * @desc    Get attendance by date range
 * @query   startDate, endDate, classId (optional)
 * @access  Admin
 */
router.get("/range", adminAttendanceController.getAttendanceByDateRange);

/**
 * @route   GET /admin/attendance/report/class/:classId
 * @desc    Get attendance report by class
 * @query   startDate, endDate
 * @access  Admin
 */
router.get(
  "/report/class/:classId",
  adminAttendanceController.getAttendanceReportByClass
);

/**
 * @route   GET /admin/attendance/export/csv
 * @desc    Export attendance to CSV
 * @query   startDate, endDate, classId (optional)
 * @access  Admin
 */
router.get("/export/csv", adminAttendanceController.exportAttendanceToCSV);

/**
 * @route   GET /admin/attendance
 * @desc    Get all attendance records
 * @query   page, limit, classId, status
 * @access  Admin
 */
router.get("/", adminAttendanceController.getAllAttendance);

/**
 * @route   POST /admin/attendance/mark
 * @desc    Mark attendance for students in a class
 * @body    { classId, date, attendanceData: [{studentId, status}] }
 * @access  Admin
 */
router.post("/mark", adminAttendanceController.markAttendance);

/**
 * @route   GET /admin/attendance/:attendanceId
 * @desc    Get attendance record by ID
 * @access  Admin
 */
router.get("/:attendanceId", adminAttendanceController.getAttendanceById);

/**
 * @route   PUT /admin/attendance/:attendanceId
 * @desc    Update attendance record
 * @body    { status: "PRESENT" | "ABSENT" | "LATE" }
 * @access  Admin
 */
router.put("/:attendanceId", adminAttendanceController.updateAttendance);

/**
 * @route   DELETE /admin/attendance/:attendanceId
 * @desc    Delete attendance record
 * @access  Admin
 */
router.delete("/:attendanceId", adminAttendanceController.deleteAttendance);

export default router;
