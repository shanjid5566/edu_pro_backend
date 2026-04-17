"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminAttendanceService_js_1 = require("../services/adminAttendanceService.js");
const queryParams_js_1 = require("../utils/queryParams.js");
class AdminAttendanceController {
    /**
     * Get today's attendance statistics
     * GET /admin/attendance/statistics/today
     */
    async getTodayStatistics(req, res) {
        try {
            const today = new Date();
            const stats = await adminAttendanceService_js_1.AdminAttendanceService.getAttendanceStatistics(today);
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch today's statistics",
            });
        }
    }
    /**
     * Get today's overall attendance overview
     * GET /admin/attendance/overview/today
     */
    async getTodayOverview(req, res) {
        try {
            const today = new Date();
            const classwise = await adminAttendanceService_js_1.AdminAttendanceService.getClasswiseAttendance(today);
            const stats = await adminAttendanceService_js_1.AdminAttendanceService.getAttendanceStatistics(today);
            res.status(200).json({
                success: true,
                data: {
                    statistics: stats,
                    classwise,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch today's overview",
            });
        }
    }
    /**
     * Get class-wise attendance for a specific date
     * GET /admin/attendance/classwise?date=2026-03-31
     */
    async getClasswiseAttendance(req, res) {
        try {
            const { date } = req.query;
            const attendanceDate = date ? new Date(date) : new Date();
            const classwise = await adminAttendanceService_js_1.AdminAttendanceService.getClasswiseAttendance(attendanceDate);
            res.status(200).json({
                success: true,
                data: classwise,
                date: attendanceDate.toISOString().split("T")[0],
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch class-wise attendance",
            });
        }
    }
    /**
     * Get all attendance records
     * GET /admin/attendance?page=1&limit=10&classId=&status=
     */
    async getAllAttendance(req, res) {
        try {
            const page = (0, queryParams_js_1.getQueryNumber)(req.query.page, 1);
            const limit = (0, queryParams_js_1.getQueryNumber)(req.query.limit, 10);
            const classId = (0, queryParams_js_1.getQueryString)(req.query.classId);
            const statusParam = (0, queryParams_js_1.getQueryString)(req.query.status);
            const status = statusParam || undefined;
            const result = await adminAttendanceService_js_1.AdminAttendanceService.getAllAttendance(page, limit, classId, status);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch attendance records",
            });
        }
    }
    /**
     * Get attendance by ID
     * GET /admin/attendance/:attendanceId
     */
    async getAttendanceById(req, res) {
        try {
            const attendanceId = req.params.attendanceId;
            const attendance = await adminAttendanceService_js_1.AdminAttendanceService.getAttendanceById(attendanceId);
            res.status(200).json({
                success: true,
                data: attendance,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || "Attendance record not found",
            });
        }
    }
    /**
     * Mark attendance for students in a class
     * POST /admin/attendance/mark
     * Body: { classId, date, attendanceData: [{studentId, status}] }
     */
    async markAttendance(req, res) {
        try {
            const { classId, date, attendanceData } = req.body;
            const userId = req.user?.id;
            if (!classId || !date || !attendanceData || !Array.isArray(attendanceData)) {
                return res.status(400).json({
                    success: false,
                    message: "classId, date, and attendanceData (array) are required",
                });
            }
            const result = await adminAttendanceService_js_1.AdminAttendanceService.markAttendance(classId, attendanceData, userId, new Date(date));
            res.status(201).json({
                success: true,
                message: result.message,
                data: {
                    count: result.count,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to mark attendance",
            });
        }
    }
    /**
     * Update attendance record
     * PUT /admin/attendance/:attendanceId
     * Body: { status: "PRESENT" | "ABSENT" | "LATE" }
     */
    async updateAttendance(req, res) {
        try {
            const attendanceId = req.params.attendanceId;
            const { status } = req.body;
            const userId = req.user?.id;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status is required",
                });
            }
            if (!["PRESENT", "ABSENT", "LATE"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status must be PRESENT, ABSENT, or LATE",
                });
            }
            const attendance = await adminAttendanceService_js_1.AdminAttendanceService.updateAttendance(attendanceId, status, userId);
            res.status(200).json({
                success: true,
                message: "Attendance updated successfully",
                data: attendance,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update attendance",
            });
        }
    }
    /**
     * Delete attendance record
     * DELETE /admin/attendance/:attendanceId
     */
    async deleteAttendance(req, res) {
        try {
            const attendanceId = req.params.attendanceId;
            await adminAttendanceService_js_1.AdminAttendanceService.deleteAttendance(attendanceId);
            res.status(200).json({
                success: true,
                message: "Attendance record deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete attendance",
            });
        }
    }
    /**
     * Get attendance by date range
     * GET /admin/attendance/range?startDate=2026-01-01&endDate=2026-03-31&classId=
     */
    async getAttendanceByDateRange(req, res) {
        try {
            const startDate = (0, queryParams_js_1.getQueryString)(req.query.startDate);
            const endDate = (0, queryParams_js_1.getQueryString)(req.query.endDate);
            const classId = (0, queryParams_js_1.getQueryString)(req.query.classId);
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: "startDate and endDate are required",
                });
            }
            const attendance = await adminAttendanceService_js_1.AdminAttendanceService.getAttendanceByDateRange(new Date(startDate), new Date(endDate), classId);
            res.status(200).json({
                success: true,
                data: attendance,
                filters: {
                    startDate,
                    endDate,
                    classId: classId || null,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch attendance by date range",
            });
        }
    }
    /**
     * Get student attendance history
     * GET /admin/attendance/student/:studentId?limit=30
     */
    async getStudentAttendanceHistory(req, res) {
        try {
            const studentId = req.params.studentId;
            const limit = parseInt(req.query.limit) || 30;
            const result = await adminAttendanceService_js_1.AdminAttendanceService.getStudentAttendanceHistory(studentId, limit);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch student attendance history",
            });
        }
    }
    /**
     * Get attendance report by class
     * GET /admin/attendance/report/class/:classId?startDate=2026-01-01&endDate=2026-03-31
     */
    async getAttendanceReportByClass(req, res) {
        try {
            const { classId } = req.params;
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: "startDate and endDate are required",
                });
            }
            const report = await adminAttendanceService_js_1.AdminAttendanceService.getAttendanceReportByClass(classId, new Date(startDate), new Date(endDate));
            res.status(200).json({
                success: true,
                data: report,
                filters: {
                    classId,
                    startDate,
                    endDate,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to generate attendance report",
            });
        }
    }
    /**
     * Export attendance to CSV
     * GET /admin/attendance/export/csv?startDate=2026-01-01&endDate=2026-03-31&classId=
     */
    async exportAttendanceToCSV(req, res) {
        try {
            const { startDate, endDate, classId } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: "startDate and endDate are required",
                });
            }
            const attendance = await adminAttendanceService_js_1.AdminAttendanceService.getAttendanceByDateRange(new Date(startDate), new Date(endDate), classId);
            // Format CSV
            const csvHeader = "Student ID,Student Name,Email,Class,Section,Date,Status\n";
            const csvRows = attendance
                .map((record) => `${record.student.id},"${record.student.user.firstName} ${record.student.user.lastName}",${record.student.user.email},${record.class.name},${record.class.section},${record.date.toISOString().split("T")[0]},${record.status}`)
                .join("\n");
            const csv = csvHeader + csvRows;
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=attendance-report.csv");
            res.send(csv);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to export attendance",
            });
        }
    }
}
exports.default = new AdminAttendanceController();
