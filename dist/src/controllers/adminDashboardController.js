"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminDashboardService_1 = __importDefault(require("../services/adminDashboardService"));
class AdminDashboardController {
    /**
     * Get admin dashboard data
     */
    async getDashboard(req, res) {
        try {
            const result = await adminDashboardService_1.default.getDashboardData();
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Dashboard error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch dashboard data",
            });
        }
    }
    /**
     * Get overall statistics
     */
    async getStats(req, res) {
        try {
            const stats = await adminDashboardService_1.default.getOverallStats();
            return res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get attendance trend
     */
    async getAttendanceTrend(req, res) {
        try {
            const data = await adminDashboardService_1.default.getAttendanceTrend();
            return res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get performance by subject
     */
    async getPerformance(req, res) {
        try {
            const data = await adminDashboardService_1.default.getPerformanceBySubject();
            return res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get today's attendance
     */
    async getTodayAttendance(req, res) {
        try {
            const data = await adminDashboardService_1.default.getTodayAttendance();
            return res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get recent activity
     */
    async getRecentActivity(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const data = await adminDashboardService_1.default.getRecentActivity(limit);
            return res.status(200).json({
                success: true,
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new AdminDashboardController();
