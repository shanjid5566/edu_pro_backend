"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacherExamService_js_1 = __importDefault(require("../services/teacherExamService.js"));
class TeacherExamController {
    // Get all exams for teacher
    async getMyExams(req, res) {
        try {
            const teacherId = req.userId;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherExamService_js_1.default.getMyExams(teacherId);
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
    // Get exams for a specific class
    async getClassExams(req, res) {
        try {
            const teacherId = req.userId;
            const { classId } = req.params;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!classId) {
                return res.status(400).json({
                    success: false,
                    message: "Class ID is required",
                });
            }
            const result = await teacherExamService_js_1.default.getClassExams(teacherId, classId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getClassExams:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exam details
    async getExamDetails(req, res) {
        try {
            const teacherId = req.userId;
            const { examId } = req.params;
            if (!teacherId) {
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
            const result = await teacherExamService_js_1.default.getExamDetails(teacherId, examId);
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
            const teacherId = req.userId;
            const { status } = req.params;
            if (!teacherId) {
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
            if (!["UPCOMING", "ONGOING", "COMPLETED"].includes(status.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status. Must be UPCOMING, ONGOING, or COMPLETED",
                });
            }
            const result = await teacherExamService_js_1.default.getExamsByStatus(teacherId, status);
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
    // Submit exam marks
    async submitMarks(req, res) {
        try {
            const teacherId = req.userId;
            const { examId } = req.params;
            const { marks } = req.body;
            if (!teacherId) {
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
            if (!marks || !Array.isArray(marks)) {
                return res.status(400).json({
                    success: false,
                    message: "Marks array is required",
                });
            }
            // Validate marks format
            for (const mark of marks) {
                if (!mark.studentId) {
                    return res.status(400).json({
                        success: false,
                        message: "Each mark entry must have studentId",
                    });
                }
            }
            const result = await teacherExamService_js_1.default.submitExamMarks(teacherId, examId, marks);
            return res.status(201).json(result);
        }
        catch (error) {
            console.error("Error in submitMarks:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get exam statistics
    async getStatistics(req, res) {
        try {
            const teacherId = req.userId;
            if (!teacherId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await teacherExamService_js_1.default.getExamStatistics(teacherId);
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
exports.default = new TeacherExamController();
