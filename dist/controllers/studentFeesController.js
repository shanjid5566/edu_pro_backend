"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentFeesService_js_1 = __importDefault(require("../services/studentFeesService.js"));
class StudentFeesController {
    // Get all fees
    async getAllFees(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentFeesService_js_1.default.getAllFees(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAllFees:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get fees by status
    async getFeesByStatus(req, res) {
        try {
            const studentId = req.userId;
            const { status } = req.params;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status is required",
                });
            }
            const result = await studentFeesService_js_1.default.getFeesByStatus(studentId, status);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getFeesByStatus:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get fee summary
    async getFeeSummary(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentFeesService_js_1.default.getFeeSummary(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getFeeSummary:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get fees by type
    async getFeesByType(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentFeesService_js_1.default.getFeesByType(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getFeesByType:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get fee timeline
    async getFeeTimeline(req, res) {
        try {
            const studentId = req.userId;
            const { limit } = req.query;
            const limitParam = limit ? parseInt(limit) : 10;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentFeesService_js_1.default.getFeeTimeline(studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getFeeTimeline:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get upcoming fees
    async getUpcomingFees(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentFeesService_js_1.default.getPendingFees(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getUpcomingFees:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get overdue fees
    async getOverdueFees(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentFeesService_js_1.default.getPaidFees(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getOverdueFees:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new StudentFeesController();
