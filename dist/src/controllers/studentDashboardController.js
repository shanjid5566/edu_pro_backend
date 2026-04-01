"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentDashboardService_js_1 = __importDefault(require("../services/studentDashboardService.js"));
class StudentDashboardController {
    // Get dashboard overview
    async getDashboardOverview(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentDashboardService_js_1.default.getDashboardOverview(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getDashboardOverview:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get attendance trend
    async getAttendanceTrend(req, res) {
        try {
            const studentId = req.userId;
            const months = parseInt(req.query.months) || 6;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentDashboardService_js_1.default.getAttendanceTrend(studentId, months);
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
    // Get subject performance
    async getSubjectPerformance(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentDashboardService_js_1.default.getSubjectPerformance(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getSubjectPerformance:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get my classes
    async getMyClasses(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentDashboardService_js_1.default.getMyClasses(studentId);
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
    // Get recent results
    async getRecentResults(req, res) {
        try {
            const studentId = req.userId;
            const limit = parseInt(req.query.limit) || 5;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentDashboardService_js_1.default.getRecentResults(studentId, limit);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getRecentResults:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new StudentDashboardController();
