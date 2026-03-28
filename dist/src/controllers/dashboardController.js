"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardService_1 = __importDefault(require("../services/dashboardService"));
class DashboardController {
    /**
     * Get complete dashboard overview
     */
    async getDashboard(req, res) {
        try {
            const data = await dashboardService_1.default.getDashboardData();
            return res.status(200).json({
                success: true,
                message: "Dashboard data retrieved successfully",
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve dashboard data",
            });
        }
    }
    /**
     * Get dashboard overview (counts only)
     */
    async getOverview(req, res) {
        try {
            const overview = await dashboardService_1.default.getOverview();
            return res.status(200).json({
                success: true,
                message: "Overview data retrieved successfully",
                data: overview,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve overview",
            });
        }
    }
    /**
     * Get attendance trend data for chart
     */
    async getAttendanceTrend(req, res) {
        try {
            const trend = await dashboardService_1.default.getAttendanceTrend();
            return res.status(200).json({
                success: true,
                message: "Attendance trend data retrieved successfully",
                data: trend,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve attendance trend",
            });
        }
    }
    /**
     * Get performance by subject data for chart
     */
    async getPerformanceBySubject(req, res) {
        try {
            const performance = await dashboardService_1.default.getPerformanceBySubject();
            return res.status(200).json({
                success: true,
                message: "Performance data retrieved successfully",
                data: performance,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve performance data",
            });
        }
    }
    /**
     * Get today's attendance summary
     */
    async getTodayAttendance(req, res) {
        try {
            const attendance = await dashboardService_1.default.getTodayAttendance();
            return res.status(200).json({
                success: true,
                message: "Today's attendance data retrieved successfully",
                data: attendance,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve today's attendance",
            });
        }
    }
    /**
     * Get recent activity
     */
    async getRecentActivity(req, res) {
        try {
            const limit = Number(req.query.limit) || 5;
            const activities = await dashboardService_1.default.getRecentActivity(limit);
            return res.status(200).json({
                success: true,
                message: "Recent activities retrieved successfully",
                data: activities,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve recent activities",
            });
        }
    }
}
exports.default = new DashboardController();
