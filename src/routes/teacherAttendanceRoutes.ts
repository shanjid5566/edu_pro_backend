import { Router } from "express";
import teacherAttendanceController from "../controllers/teacherAttendanceController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require teacher or admin authentication
router.use(verifyToken, checkRole("TEACHER", "ADMIN"));

/**
 * @route GET /teacher/attendance/:classId/students
 * @description Get students in a class for attendance marking
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 */
router.get("/:classId/students", teacherAttendanceController.getClassStudents);

/**
 * @route POST /teacher/attendance/:classId/mark
 * @description Mark attendance for a class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 * @body {Array} attendanceData - Array of {studentId, status}
 * @body {string} date - Attendance date (YYYY-MM-DD)
 */
router.post("/:classId/mark", teacherAttendanceController.markAttendance);

/**
 * @route GET /teacher/attendance/:classId/records
 * @description Get attendance records for a class
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 * @query {string} startDate - Start date (optional, YYYY-MM-DD)
 * @query {string} endDate - End date (optional, YYYY-MM-DD)
 */
router.get("/:classId/records", teacherAttendanceController.getAttendanceRecords);

/**
 * @route GET /teacher/attendance/:classId/student/:studentId
 * @description Get attendance summary for a student
 * @access Private - Teacher/Admin
 * @param {string} classId - Class ID
 * @param {string} studentId - Student ID
 */
router.get(
  "/:classId/student/:studentId",
  teacherAttendanceController.getStudentSummary
);

export default router;
