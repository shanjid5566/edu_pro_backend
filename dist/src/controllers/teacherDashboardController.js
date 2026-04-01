"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacherDashboardService_js_1 = __importDefault(require("../services/teacherDashboardService.js"));
class TeacherDashboardController {
    async getDashboardOverview(req, res) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherDashboardService_js_1.default.getDashboardOverview(teacherId);
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
    async getAttendanceTrend(req, res) {
        try {
            const teacherId = req.user?.id;
            const months = parseInt(req.query.months) || 6;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherDashboardService_js_1.default.getAttendanceTrend(teacherId, months);
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
    async getStudentPerformance(req, res) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherDashboardService_js_1.default.getStudentPerformanceBySubject(teacherId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getStudentPerformance:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async getMyClasses(req, res) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherDashboardService_js_1.default.getMyClasses(teacherId);
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
    async getTeacherProfile(req, res) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherDashboardService_js_1.default.getTeacherProfile(teacherId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getTeacherProfile:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new TeacherDashboardController();
