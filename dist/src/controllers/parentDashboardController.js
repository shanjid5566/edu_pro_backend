"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parentDashboardService_js_1 = __importDefault(require("../services/parentDashboardService.js"));
class ParentDashboardController {
    // Get my children
    async getMyChildren(req, res) {
        try {
            const parentId = req.userId;
            if (!parentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await parentDashboardService_js_1.default.getMyChildren(parentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getMyChildren:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get child overview
    async getChildOverview(req, res) {
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
            const result = await parentDashboardService_js_1.default.getChildOverview(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getChildOverview:", error);
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
            const result = await parentDashboardService_js_1.default.getAttendanceTrend(parentId, studentId, monthsParam);
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
    // Get recent results
    async getRecentResults(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            const { limit } = req.query;
            const limitParam = limit ? parseInt(limit) : 5;
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
            const result = await parentDashboardService_js_1.default.getRecentResults(parentId, studentId, limitParam);
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
    // Get subject performance
    async getSubjectPerformance(req, res) {
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
            const result = await parentDashboardService_js_1.default.getSubjectPerformance(parentId, studentId);
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
    // Get upcoming events
    async getUpcomingEvents(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            const { limit } = req.query;
            const limitParam = limit ? parseInt(limit) : 5;
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
            const result = await parentDashboardService_js_1.default.getUpcomingEvents(parentId, studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getUpcomingEvents:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get notifications
    async getNotifications(req, res) {
        try {
            const parentId = req.userId;
            const { studentId } = req.params;
            const { limit } = req.query;
            const limitParam = limit ? parseInt(limit) : 5;
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
            const result = await parentDashboardService_js_1.default.getNotifications(parentId, studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getNotifications:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new ParentDashboardController();
