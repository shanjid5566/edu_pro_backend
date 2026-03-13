import { attendanceService } from "../services/attendance.service";
import { ValidationError } from "../utils/errors";
import { buildCsv } from "../utils/csv";
export class AttendanceController {
    /**
     * GET /api/v1/attendance/daily-stats
     * Get daily attendance statistics
     */
    async getDailyStats(req, res) {
        try {
            const dateParam = String(Array.isArray(req.query.date) ? req.query.date[0] : req.query.date || "");
            const date = dateParam ? new Date(dateParam) : new Date();
            if (isNaN(date.getTime())) {
                throw new ValidationError("Invalid date format");
            }
            const stats = await attendanceService.getDailyStatistics(date);
            res.json({
                success: true,
                message: "Daily statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve daily statistics";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance/overview
     * Get attendance summary for today
     */
    async getOverview(req, res) {
        try {
            const dateParam = String(Array.isArray(req.query.date) ? req.query.date[0] : req.query.date || "");
            const date = dateParam ? new Date(dateParam) : new Date();
            if (isNaN(date.getTime())) {
                throw new ValidationError("Invalid date format");
            }
            const summary = await attendanceService.getDailySummary(date);
            res.json({
                success: true,
                message: "Attendance overview retrieved successfully",
                data: summary,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve attendance overview";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance/class-wise
     * Get class-wise attendance breakdown
     */
    async getClassWiseAttendance(req, res) {
        try {
            const dateParam = String(Array.isArray(req.query.date) ? req.query.date[0] : req.query.date || "");
            const date = dateParam ? new Date(dateParam) : new Date();
            if (isNaN(date.getTime())) {
                throw new ValidationError("Invalid date format");
            }
            const classWise = await attendanceService.getClassWiseAttendance(date);
            res.json({
                success: true,
                message: "Class-wise attendance retrieved successfully",
                data: classWise,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve class-wise attendance";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance
     * Get attendance records with pagination
     */
    async getAttendanceRecords(req, res) {
        try {
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
            const studentIdParam = String(Array.isArray(req.query.studentId) ? req.query.studentId[0] : req.query.studentId || "");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const startDateParam = String(Array.isArray(req.query.startDate) ? req.query.startDate[0] : req.query.startDate || "");
            const endDateParam = String(Array.isArray(req.query.endDate) ? req.query.endDate[0] : req.query.endDate || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (page < 1) {
                throw new ValidationError("Page must be greater than 0");
            }
            if (pageSize < 1 || pageSize > 100) {
                throw new ValidationError("PageSize must be between 1 and 100");
            }
            let startDate, endDate;
            if (startDateParam) {
                startDate = new Date(startDateParam);
                if (isNaN(startDate.getTime())) {
                    throw new ValidationError("Invalid start date format");
                }
            }
            if (endDateParam) {
                endDate = new Date(endDateParam);
                if (isNaN(endDate.getTime())) {
                    throw new ValidationError("Invalid end date format");
                }
            }
            const result = await attendanceService.getAttendanceRecords(page, pageSize, classIdParam || undefined, studentIdParam || undefined, startDate, endDate, statusParam || undefined);
            res.json({
                success: true,
                message: "Attendance records retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve attendance records";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance/export
     * Export attendance records as CSV
     */
    async exportAttendance(req, res) {
        try {
            const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
            const studentIdParam = String(Array.isArray(req.query.studentId) ? req.query.studentId[0] : req.query.studentId || "");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const startDateParam = String(Array.isArray(req.query.startDate) ? req.query.startDate[0] : req.query.startDate || "");
            const endDateParam = String(Array.isArray(req.query.endDate) ? req.query.endDate[0] : req.query.endDate || "");
            const dateParam = String(Array.isArray(req.query.date) ? req.query.date[0] : req.query.date || "");
            let startDate;
            let endDate;
            if (dateParam) {
                const selectedDate = new Date(dateParam);
                if (isNaN(selectedDate.getTime())) {
                    throw new ValidationError("Invalid date format");
                }
                startDate = new Date(selectedDate);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(selectedDate);
                endDate.setHours(23, 59, 59, 999);
            }
            else {
                if (startDateParam) {
                    startDate = new Date(startDateParam);
                    if (isNaN(startDate.getTime())) {
                        throw new ValidationError("Invalid start date format");
                    }
                }
                if (endDateParam) {
                    endDate = new Date(endDateParam);
                    if (isNaN(endDate.getTime())) {
                        throw new ValidationError("Invalid end date format");
                    }
                }
            }
            const firstPage = await attendanceService.getAttendanceRecords(1, 1, classIdParam || undefined, studentIdParam || undefined, startDate, endDate, statusParam || undefined);
            const pageSize = Math.max(firstPage.pagination.total, 1);
            const result = await attendanceService.getAttendanceRecords(1, pageSize, classIdParam || undefined, studentIdParam || undefined, startDate, endDate, statusParam || undefined);
            const rows = result.records.map((record) => ({
                id: record.id,
                date: record.date,
                class: `${record.class?.name || ""}-${record.class?.section || ""}`,
                studentName: record.student?.user?.name || "",
                studentEmail: record.student?.user?.email || "",
                status: record.status,
                markedBy: record.teacher?.user?.name || "",
            }));
            const csv = buildCsv(rows, ["id", "date", "class", "studentName", "studentEmail", "status", "markedBy"]);
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename=attendance-${new Date().toISOString().slice(0, 10)}.csv`);
            res.status(200).send(csv);
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to export attendance";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance/:id
     * Get single attendance record
     */
    async getAttendanceById(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Attendance ID is required");
            }
            const attendance = await attendanceService.getAttendanceById(id);
            res.json({
                success: true,
                message: "Attendance record retrieved successfully",
                data: attendance,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve attendance record";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * POST /api/v1/attendance
     * Mark attendance for a student
     */
    async markAttendance(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ValidationError("User not authenticated");
            }
            const { studentId, classId, date, status } = req.body;
            if (!studentId || !studentId.trim()) {
                throw new ValidationError("Student ID is required");
            }
            if (!classId || !classId.trim()) {
                throw new ValidationError("Class ID is required");
            }
            if (!date) {
                throw new ValidationError("Date is required");
            }
            if (!status) {
                throw new ValidationError("Status is required");
            }
            const attendance = await attendanceService.markAttendance({ studentId, classId, date: new Date(date), status }, userId);
            res.status(201).json({
                success: true,
                message: "Attendance marked successfully",
                data: attendance,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to mark attendance";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * PUT /api/v1/attendance/:id
     * Update attendance record
     */
    async updateAttendance(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Attendance ID is required");
            }
            const { status, date } = req.body;
            if (!status && !date) {
                throw new ValidationError("At least one field (status or date) is required");
            }
            const attendance = await attendanceService.updateAttendance(id, {
                status,
                date: date ? new Date(date) : undefined,
            });
            res.json({
                success: true,
                message: "Attendance updated successfully",
                data: attendance,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to update attendance";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * DELETE /api/v1/attendance/:id
     * Delete attendance record
     */
    async deleteAttendance(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Attendance ID is required");
            }
            await attendanceService.deleteAttendance(id);
            res.json({
                success: true,
                message: "Attendance deleted successfully",
                data: null,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to delete attendance";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * POST /api/v1/attendance/bulk
     * Bulk mark attendance for a class
     */
    async bulkMarkAttendance(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new ValidationError("User not authenticated");
            }
            const { classId, date, attendances } = req.body;
            if (!classId || !classId.trim()) {
                throw new ValidationError("Class ID is required");
            }
            if (!date) {
                throw new ValidationError("Date is required");
            }
            if (!Array.isArray(attendances) || attendances.length === 0) {
                throw new ValidationError("Attendances array is required and must not be empty");
            }
            const result = await attendanceService.bulkMarkAttendance({
                classId,
                date: new Date(date),
                attendances,
            }, userId);
            res.status(201).json({
                success: true,
                message: "Bulk attendance marked successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to bulk mark attendance";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance/student/:studentId/report
     * Get student attendance report
     */
    async getStudentReport(req, res) {
        try {
            const studentId = String(Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId);
            const startDateParam = String(Array.isArray(req.query.startDate) ? req.query.startDate[0] : req.query.startDate || "");
            const endDateParam = String(Array.isArray(req.query.endDate) ? req.query.endDate[0] : req.query.endDate || "");
            if (!studentId || !studentId.trim()) {
                throw new ValidationError("Student ID is required");
            }
            if (!startDateParam || !endDateParam) {
                throw new ValidationError("Start date and end date are required");
            }
            const startDate = new Date(startDateParam);
            const endDate = new Date(endDateParam);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new ValidationError("Invalid date format");
            }
            const report = await attendanceService.getStudentAttendanceReport(studentId, startDate, endDate);
            res.json({
                success: true,
                message: "Student attendance report retrieved successfully",
                data: report,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve student report";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/attendance/student/:studentId/percentage
     * Get student attendance percentage
     */
    async getStudentPercentage(req, res) {
        try {
            const studentId = String(Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId);
            const startDateParam = String(Array.isArray(req.query.startDate) ? req.query.startDate[0] : req.query.startDate || "");
            const endDateParam = String(Array.isArray(req.query.endDate) ? req.query.endDate[0] : req.query.endDate || "");
            if (!studentId || !studentId.trim()) {
                throw new ValidationError("Student ID is required");
            }
            let startDate, endDate;
            if (startDateParam && endDateParam) {
                startDate = new Date(startDateParam);
                endDate = new Date(endDateParam);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new ValidationError("Invalid date format");
                }
            }
            const percentage = await attendanceService.getStudentAttendancePercentage(studentId, startDate, endDate);
            res.json({
                success: true,
                message: "Student attendance percentage retrieved successfully",
                data: percentage,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || "Failed to retrieve student percentage";
            res.status(status).json({
                success: false,
                message,
                error: error.message,
            });
        }
    }
}
export const attendanceController = new AttendanceController();
//# sourceMappingURL=attendance.controller.js.map