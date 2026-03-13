import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { attendanceController } from "../controllers/attendance.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();
/**
 * Validation middleware to handle errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};
// ========================
// Public Routes (No Auth Required)
// ========================
/**
 * @swagger
 * /api/v1/attendance/daily-stats:
 *   get:
 *     tags: [Attendance]
 *     summary: Get daily attendance statistics
 *     description: Retrieve daily attendance summary with class-wise breakdown
 *     parameters:
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for statistics (defaults to today)
 *     responses:
 *       200:
 *         description: Daily statistics retrieved successfully
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get("/daily-stats", [
    query("date").optional().isISO8601().withMessage("Invalid date format"),
], handleValidationErrors, attendanceController.getDailyStats.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/overview:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance overview/summary
 *     description: Get attendance summary (present, absent, late counts)
 *     parameters:
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for overview (defaults to today)
 *     responses:
 *       200:
 *         description: Overview retrieved successfully
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get("/overview", [
    query("date").optional().isISO8601().withMessage("Invalid date format"),
], handleValidationErrors, attendanceController.getOverview.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/class-wise:
 *   get:
 *     tags: [Attendance]
 *     summary: Get class-wise attendance
 *     description: Get attendance breakdown by class
 *     parameters:
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for class-wise stats (defaults to today)
 *     responses:
 *       200:
 *         description: Class-wise attendance retrieved successfully
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get("/class-wise", [
    query("date").optional().isISO8601().withMessage("Invalid date format"),
], handleValidationErrors, attendanceController.getClassWiseAttendance.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance records
 *     description: Retrieve attendance records with pagination and filters
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: classId
 *         in: query
 *         schema:
 *           type: string
 *       - name: studentId
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE]
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/", [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("PageSize must be between 1 and 100"),
    query("status").optional().isIn(["PRESENT", "ABSENT", "LATE"]).withMessage("Invalid status"),
    query("startDate").optional().isISO8601().withMessage("Invalid start date format"),
    query("endDate").optional().isISO8601().withMessage("Invalid end date format"),
], handleValidationErrors, attendanceController.getAttendanceRecords.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/export:
 *   get:
 *     tags: [Attendance]
 *     summary: Export attendance records as CSV
 *     description: Export filtered attendance records (supports date or start/end range)
 */
router.get("/export", attendanceController.exportAttendance.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   get:
 *     tags: [Attendance]
 *     summary: Get single attendance record
 *     description: Retrieve details of a specific attendance record
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 *       404:
 *         description: Attendance not found
 *       500:
 *         description: Server error
 */
router.get("/:id", [
    param("id").notEmpty().withMessage("Attendance ID is required"),
], handleValidationErrors, attendanceController.getAttendanceById.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/student/{studentId}/report:
 *   get:
 *     tags: [Attendance]
 *     summary: Get student attendance report
 *     description: Get detailed attendance report for a student
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/student/:studentId/report", [
    param("studentId").notEmpty().withMessage("Student ID is required"),
    query("startDate").notEmpty().isISO8601().withMessage("Start date is required and must be valid"),
    query("endDate").notEmpty().isISO8601().withMessage("End date is required and must be valid"),
], handleValidationErrors, attendanceController.getStudentReport.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/student/{studentId}/percentage:
 *   get:
 *     tags: [Attendance]
 *     summary: Get student attendance percentage
 *     description: Get attendance percentage for a student
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Percentage retrieved successfully
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/student/:studentId/percentage", [
    param("studentId").notEmpty().withMessage("Student ID is required"),
], handleValidationErrors, attendanceController.getStudentPercentage.bind(attendanceController));
// ========================
// Teacher Routes (Auth Required - Teacher Only)
// ========================
router.get("/teacher/sheet", verifyToken, requireRole("TEACHER", "teacher"), [
    query("classId").notEmpty().withMessage("classId is required"),
    query("date").optional().isISO8601().withMessage("Invalid date format"),
], handleValidationErrors, attendanceController.getTeacherAttendanceSheet.bind(attendanceController));
router.post("/teacher/sheet", verifyToken, requireRole("TEACHER", "teacher"), [
    body("classId").notEmpty().trim().withMessage("classId is required"),
    body("date").notEmpty().isISO8601().withMessage("Valid date is required"),
    body("attendances").isArray().withMessage("attendances must be an array"),
    body("attendances.*.studentId").notEmpty().withMessage("studentId is required"),
    body("attendances.*.status").isIn(["PRESENT", "ABSENT", "LATE"]).withMessage("status must be PRESENT, ABSENT, or LATE"),
], handleValidationErrors, attendanceController.saveTeacherAttendanceSheet.bind(attendanceController));
router.get("/teacher/recent", verifyToken, requireRole("TEACHER", "teacher"), [
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50"),
], handleValidationErrors, attendanceController.getTeacherRecentAttendance.bind(attendanceController));
// ========================
// Protected Routes (Auth Required - Admin Only)
// ========================
/**
 * @swagger
 * /api/v1/attendance:
 *   post:
 *     tags: [Attendance]
 *     summary: Mark attendance for a student
 *     description: Mark attendance for a student (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - classId
 *               - date
 *               - status
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE]
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, requireRole("ADMIN", "admin"), [
    body("studentId").notEmpty().trim().withMessage("Student ID is required"),
    body("classId").notEmpty().trim().withMessage("Class ID is required"),
    body("date").notEmpty().isISO8601().withMessage("Valid date is required"),
    body("status").notEmpty().isIn(["PRESENT", "ABSENT", "LATE"]).withMessage("Status must be PRESENT, ABSENT, or LATE"),
], handleValidationErrors, attendanceController.markAttendance.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   put:
 *     tags: [Attendance]
 *     summary: Update attendance record
 *     description: Update an attendance record (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attendance not found
 *       500:
 *         description: Server error
 */
router.put("/:id", verifyToken, requireRole("ADMIN", "admin"), [
    param("id").notEmpty().withMessage("Attendance ID is required"),
    body("status").optional().isIn(["PRESENT", "ABSENT", "LATE"]).withMessage("Invalid status"),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
], handleValidationErrors, attendanceController.updateAttendance.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   delete:
 *     tags: [Attendance]
 *     summary: Delete attendance record
 *     description: Delete an attendance record (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Attendance deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attendance not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", verifyToken, requireRole("ADMIN", "admin"), [
    param("id").notEmpty().withMessage("Attendance ID is required"),
], handleValidationErrors, attendanceController.deleteAttendance.bind(attendanceController));
/**
 * @swagger
 * /api/v1/attendance/bulk:
 *   post:
 *     tags: [Attendance]
 *     summary: Bulk mark attendance for a class
 *     description: Mark attendance for multiple students at once (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - date
 *               - attendances
 *             properties:
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               attendances:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - status
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [PRESENT, ABSENT, LATE]
 *     responses:
 *       201:
 *         description: Bulk attendance marked successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/bulk", verifyToken, requireRole("ADMIN", "admin"), [
    body("classId").notEmpty().trim().withMessage("Class ID is required"),
    body("date").notEmpty().isISO8601().withMessage("Valid date is required"),
    body("attendances").isArray({ min: 1 }).withMessage("Attendances must be a non-empty array"),
    body("attendances.*.studentId").notEmpty().trim().withMessage("Student ID is required for each attendance"),
    body("attendances.*.status").notEmpty().isIn(["PRESENT", "ABSENT", "LATE"]).withMessage("Valid status is required for each attendance"),
], handleValidationErrors, attendanceController.bulkMarkAttendance.bind(attendanceController));
export default router;
//# sourceMappingURL=attendance.routes.js.map