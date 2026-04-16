"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacherAttendanceService_js_1 = __importDefault(require("../services/teacherAttendanceService.js"));
function getValidatedClassId(classIdParam) {
    const classId = classIdParam?.trim();
    if (!classId) {
        throw new Error("Class ID is required");
    }
    if (classId.startsWith(":")) {
        throw new Error("Invalid Class ID. Replace :classId with a real class UUID");
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(classId)) {
        throw new Error("Invalid Class ID format");
    }
    return classId;
}
class TeacherAttendanceController {
    // Get students in a class for attendance marking
    async getClassStudents(req, res) {
        try {
            const teacherId = req.userId;
            const classId = getValidatedClassId(req.params.classId);
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherAttendanceService_js_1.default.getClassStudentsForAttendance(teacherId, classId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getClassStudents:", error);
            if (error instanceof Error &&
                (error.message.includes("Class ID") ||
                    error.message.includes("Invalid Class ID"))) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Mark attendance for a class
    async markAttendance(req, res) {
        try {
            const teacherId = req.userId;
            const classId = getValidatedClassId(req.params.classId);
            const { attendanceData, date } = req.body;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!attendanceData || !Array.isArray(attendanceData)) {
                return res.status(400).json({
                    success: false,
                    message: "Attendance data array is required",
                });
            }
            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: "Date is required",
                });
            }
            // Validate attendance data
            for (const item of attendanceData) {
                if (!item.studentId || !item.status) {
                    return res.status(400).json({
                        success: false,
                        message: "Each attendance record must have studentId and status",
                    });
                }
                if (!["PRESENT", "ABSENT", "LATE"].includes(item.status)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid status. Must be PRESENT, ABSENT, or LATE",
                    });
                }
            }
            const attendanceDate = new Date(date);
            const result = await teacherAttendanceService_js_1.default.markAttendance(teacherId, classId, attendanceData, attendanceDate);
            return res.status(201).json(result);
        }
        catch (error) {
            console.error("Error in markAttendance:", error);
            if (error instanceof Error &&
                (error.message.includes("Class ID") ||
                    error.message.includes("Invalid Class ID"))) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get attendance records for a class
    async getAttendanceRecords(req, res) {
        try {
            const teacherId = req.userId;
            const classId = getValidatedClassId(req.params.classId);
            const { startDate, endDate } = req.query;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            let start;
            let end;
            if (startDate) {
                start = new Date(startDate);
            }
            if (endDate) {
                end = new Date(endDate);
            }
            const result = await teacherAttendanceService_js_1.default.getClassAttendanceRecords(teacherId, classId, start, end);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAttendanceRecords:", error);
            if (error instanceof Error &&
                (error.message.includes("Class ID") ||
                    error.message.includes("Invalid Class ID"))) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get student attendance summary
    async getStudentSummary(req, res) {
        try {
            const teacherId = req.userId;
            const classId = getValidatedClassId(req.params.classId);
            const { studentId } = req.params;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message: "Student ID is required",
                });
            }
            const result = await teacherAttendanceService_js_1.default.getStudentAttendanceSummary(teacherId, classId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getStudentSummary:", error);
            if (error instanceof Error &&
                (error.message.includes("Class ID") ||
                    error.message.includes("Invalid Class ID"))) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new TeacherAttendanceController();
