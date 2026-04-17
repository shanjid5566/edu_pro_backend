"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parentChildFeesService_js_1 = __importDefault(require("../services/parentChildFeesService.js"));
class ParentChildFeesController {
    // Get all fees
    async getAllFees(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const { limit, offset } = req.query;
            const limitParam = limit ? parseInt(limit) : 50;
            const offsetParam = offset ? parseInt(offset) : 0;
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
            const result = await parentChildFeesService_js_1.default.getAllFees(parentId, studentId, limitParam, offsetParam);
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
    // Get fee summary
    async getFeeSummary(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
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
            const result = await parentChildFeesService_js_1.default.getFeeSummary(parentId, studentId);
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
    // Get fees by status
    async getFeesByStatus(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const status = req.params.status;
            const { limit, offset } = req.query;
            const limitParam = limit ? parseInt(limit) : 50;
            const offsetParam = offset ? parseInt(offset) : 0;
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
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status is required",
                });
            }
            const result = await parentChildFeesService_js_1.default.getFeesByStatus(parentId, studentId, status, limitParam, offsetParam);
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
    // Get fees by type
    async getFeesByType(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
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
            const result = await parentChildFeesService_js_1.default.getFeesByType(parentId, studentId);
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
    // Get upcoming fees
    async getUpcomingFees(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
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
            const result = await parentChildFeesService_js_1.default.getUpcomingFees(parentId, studentId);
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
            const parentId = req.userId;
            const studentId = req.params.studentId;
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
            const result = await parentChildFeesService_js_1.default.getOverdueFees(parentId, studentId);
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
    // Get fees timeline
    async getFeesTimeline(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
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
            const result = await parentChildFeesService_js_1.default.getFeesTimeline(parentId, studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getFeesTimeline:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new ParentChildFeesController();
