"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentResultsService_js_1 = __importDefault(require("../services/studentResultsService.js"));
class StudentResultsController {
    // Get all results
    async getAllResults(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentResultsService_js_1.default.getAllResults(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAllResults:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get results by subject
    async getResultsBySubject(req, res) {
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
            const result = await studentResultsService_js_1.default.getResultsBySubject(studentId, subjectId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getResultsBySubject:", error);
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
            const result = await studentResultsService_js_1.default.getSubjectPerformance(studentId);
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
    // Get class comparison
    async getClassComparison(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentResultsService_js_1.default.getClassComparison(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getClassComparison:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get performance trend
    async getPerformanceTrend(req, res) {
        try {
            const studentId = req.userId;
            const { months } = req.query;
            const monthsParam = months ? parseInt(months) : 6;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentResultsService_js_1.default.getPerformanceTrend(studentId, monthsParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getPerformanceTrend:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get results summary
    async getResultsSummary(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentResultsService_js_1.default.getResultsSummary(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getResultsSummary:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new StudentResultsController();
