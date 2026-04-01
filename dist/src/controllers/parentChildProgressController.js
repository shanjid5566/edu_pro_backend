"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parentChildProgressService_js_1 = __importDefault(require("../services/parentChildProgressService.js"));
class ParentChildProgressController {
    // Get progress metrics
    async getProgressMetrics(req, res) {
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
            const result = await parentChildProgressService_js_1.default.getProgressMetrics(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getProgressMetrics:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get progress over time
    async getProgressOverTime(req, res) {
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
            const result = await parentChildProgressService_js_1.default.getProgressOverTime(parentId, studentId, monthsParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getProgressOverTime:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get subject-wise performance
    async getSubjectWisePerformance(req, res) {
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
            const result = await parentChildProgressService_js_1.default.getSubjectWisePerformance(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getSubjectWisePerformance:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exam results with trends
    async getExamResultsWithTrends(req, res) {
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
            const result = await parentChildProgressService_js_1.default.getExamResultsWithTrends(parentId, studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getExamResultsWithTrends:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get performance summary
    async getPerformanceSummary(req, res) {
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
            const result = await parentChildProgressService_js_1.default.getPerformanceSummary(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getPerformanceSummary:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new ParentChildProgressController();
