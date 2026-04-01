"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentExamService_js_1 = __importDefault(require("../services/studentExamService.js"));
class StudentExamController {
    // Get all exams
    async getMyExams(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentExamService_js_1.default.getMyExams(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getMyExams:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get upcoming exams
    async getUpcomingExams(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentExamService_js_1.default.getUpcomingExams(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getUpcomingExams:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exam details
    async getExamDetails(req, res) {
        try {
            const studentId = req.userId;
            const { examId } = req.params;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!examId) {
                return res.status(400).json({
                    success: false,
                    message: "Exam ID is required",
                });
            }
            const result = await studentExamService_js_1.default.getExamDetails(studentId, examId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getExamDetails:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exams by status
    async getExamsByStatus(req, res) {
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
            const result = await studentExamService_js_1.default.getExamsByStatus(studentId, status);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getExamsByStatus:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exam results
    async getExamResults(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentExamService_js_1.default.getExamResults(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getExamResults:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exam statistics
    async getStatistics(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentExamService_js_1.default.getExamStatistics(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getStatistics:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new StudentExamController();
