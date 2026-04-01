"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parentChildAttendanceService_js_1 = __importDefault(require("../services/parentChildAttendanceService.js"));
class ParentChildAttendanceController {
    // Get attendance summary
    async getAttendanceSummary(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            if (!parentId) {
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
            const result = await parentChildAttendanceService_js_1.default.getAttendanceSummary(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAttendanceSummary:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get attendance trend
    async getAttendanceTrend(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            const { months } = req.query;
            const monthsParam = months ? parseInt(months) : 6;
            if (!parentId) {
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
            const result = await parentChildAttendanceService_js_1.default.getAttendanceTrend(parentId, studentId, monthsParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAttendanceTrend:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get recent attendance
    async getRecentAttendance(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            const { limit } = req.query;
            const limitParam = limit ? parseInt(limit) : 10;
            if (!parentId) {
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
            const result = await parentChildAttendanceService_js_1.default.getRecentAttendance(parentId, studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getRecentAttendance:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get attendance by date range
    async getAttendanceByDateRange(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            const { startDate, endDate } = req.query;
            if (!parentId) {
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
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: "startDate and endDate are required",
                });
            }
            const result = await parentChildAttendanceService_js_1.default.getAttendanceByDateRange(parentId, studentId, startDate, endDate);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAttendanceByDateRange:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get attendance statistics
    async getAttendanceStatistics(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            if (!parentId) {
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
            const result = await parentChildAttendanceService_js_1.default.getAttendanceStatistics(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAttendanceStatistics:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new ParentChildAttendanceController();
