"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminExamService_1 = __importDefault(require("../services/adminExamService"));
class AdminExamController {
    /**
     * Get all exams with pagination, search, and filters
     */
    async getAllExams(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const classId = req.query.classId || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminExamService_1.default.getAllExams({
                skip,
                take: limit,
                search: search || undefined,
                classId,
                status,
            });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch exams",
            });
        }
    }
    /**
     * Get exam by ID
     */
    async getExamById(req, res) {
        try {
            const examId = req.params.examId;
            if (!examId) {
                res.status(400).json({
                    success: false,
                    message: "Exam ID is required",
                });
                return;
            }
            const result = await adminExamService_1.default.getExamById(examId);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch exam",
            });
        }
    }
    /**
     * Create exam
     */
    async createExam(req, res) {
        try {
            const { name, classId, subjectId, date, duration, totalMarks, type } = req.body;
            // Validation
            if (!name || !classId || !subjectId || !date || !duration || !totalMarks || !type) {
                res.status(400).json({
                    success: false,
                    message: "Exam name, class, subject, date, duration, total marks, and type are required",
                });
                return;
            }
            if (totalMarks < 1) {
                res.status(400).json({
                    success: false,
                    message: "Total marks must be at least 1",
                });
                return;
            }
            if (!["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"].includes(type)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid exam type. Must be MONTHLY, QUARTERLY, HALF_YEARLY, or YEARLY",
                });
                return;
            }
            const result = await adminExamService_1.default.createExam({
                name,
                classId,
                subjectId,
                date,
                duration,
                totalMarks,
                type,
            });
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to create exam",
            });
        }
    }
    /**
     * Update exam
     */
    async updateExam(req, res) {
        try {
            const examId = req.params.examId;
            const { name, classId, subjectId, date, duration, totalMarks, type, status } = req.body;
            if (!examId) {
                res.status(400).json({
                    success: false,
                    message: "Exam ID is required",
                });
                return;
            }
            if (totalMarks && totalMarks < 1) {
                res.status(400).json({
                    success: false,
                    message: "Total marks must be at least 1",
                });
                return;
            }
            if (type &&
                !["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"].includes(type)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid exam type. Must be MONTHLY, QUARTERLY, HALF_YEARLY, or YEARLY",
                });
                return;
            }
            if (status &&
                !["UPCOMING", "ONGOING", "COMPLETED"].includes(status)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid status. Must be UPCOMING, ONGOING, or COMPLETED",
                });
                return;
            }
            const result = await adminExamService_1.default.updateExam(examId, {
                name,
                classId,
                subjectId,
                date,
                duration,
                totalMarks,
                type,
                status,
            });
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update exam",
            });
        }
    }
    /**
     * Delete exam
     */
    async deleteExam(req, res) {
        try {
            const examId = req.params.examId;
            if (!examId) {
                res.status(400).json({
                    success: false,
                    message: "Exam ID is required",
                });
                return;
            }
            const result = await adminExamService_1.default.deleteExam(examId);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete exam",
            });
        }
    }
    /**
     * Search exams
     */
    async searchExams(req, res) {
        try {
            const query = req.query.q || "";
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
                return;
            }
            const result = await adminExamService_1.default.searchExams(query, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to search exams",
            });
        }
    }
    /**
     * Get exams by class
     */
    async getExamsByClass(req, res) {
        try {
            const classId = req.params.classId;
            if (!classId) {
                res.status(400).json({
                    success: false,
                    message: "Class ID is required",
                });
                return;
            }
            const result = await adminExamService_1.default.getExamsByClass(classId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch exams for class",
            });
        }
    }
    /**
     * Get exams by status
     */
    async getExamsByStatus(req, res) {
        try {
            const status = req.params.status;
            const limit = parseInt(req.query.limit) || 10;
            if (!status) {
                res.status(400).json({
                    success: false,
                    message: "Status is required",
                });
                return;
            }
            const result = await adminExamService_1.default.getExamsByStatus(status, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch exams by status",
            });
        }
    }
    /**
     * Get exam statistics
     */
    async getExamStatistics(req, res) {
        try {
            const result = await adminExamService_1.default.getExamStatistics();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch exam statistics",
            });
        }
    }
}
exports.default = new AdminExamController();
