"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentClassService_js_1 = __importDefault(require("../services/studentClassService.js"));
class StudentClassController {
    // Get all my classes
    async getMyClasses(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentClassService_js_1.default.getMyClasses(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getMyClasses:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get class schedule by day
    async getClassScheduleByDay(req, res) {
        try {
            const studentId = req.userId;
            const { day } = req.query;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentClassService_js_1.default.getClassScheduleByDay(studentId, day);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getClassScheduleByDay:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get today's classes
    async getTodayClasses(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentClassService_js_1.default.getTodayClasses(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getTodayClasses:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get subject details
    async getSubjectDetails(req, res) {
        try {
            const studentId = req.userId;
            const { subjectId } = req.params;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!subjectId) {
                return res.status(400).json({
                    success: false,
                    message: "Subject ID is required",
                });
            }
            const result = await studentClassService_js_1.default.getSubjectDetails(studentId, subjectId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getSubjectDetails:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get weekly timetable
    async getWeeklyTimetable(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentClassService_js_1.default.getWeeklyTimetable(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getWeeklyTimetable:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new StudentClassController();
