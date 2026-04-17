"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentNoticeService_js_1 = __importDefault(require("../services/studentNoticeService.js"));
class StudentNoticeController {
    // Get all notices
    async getAllNotices(req, res) {
        try {
            const studentId = req.userId;
            const { limit, offset } = req.query;
            const limitParam = limit ? parseInt(limit) : 50;
            const offsetParam = offset ? parseInt(offset) : 0;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentNoticeService_js_1.default.getAllNotices(studentId, limitParam, offsetParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getAllNotices:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get pinned notices
    async getPinnedNotices(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentNoticeService_js_1.default.getPinnedNotices(studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getPinnedNotices:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get recent notices
    async getRecentNotices(req, res) {
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
            const result = await studentNoticeService_js_1.default.getRecentNotices(studentId, limitParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getRecentNotices:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get notices by category
    async getNoticesByCategory(req, res) {
        try {
            const studentId = req.userId;
            const { category } = req.params;
            const { limit, offset } = req.query;
            const limitParam = limit ? parseInt(limit) : 50;
            const offsetParam = offset ? parseInt(offset) : 0;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Category is required",
                });
            }
            const result = await studentNoticeService_js_1.default.getNoticesByCategory(studentId, category, limitParam, offsetParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getNoticesByCategory:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Search notices
    async searchNotices(req, res) {
        try {
            const studentId = req.userId;
            const { keyword, limit, offset } = req.query;
            const limitParam = limit ? parseInt(limit) : 50;
            const offsetParam = offset ? parseInt(offset) : 0;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!keyword) {
                return res.status(400).json({
                    success: false,
                    message: "Keyword is required for search",
                });
            }
            const result = await studentNoticeService_js_1.default.searchNotices(studentId, keyword, limitParam, offsetParam);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in searchNotices:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get notice details
    async getNoticeDetails(req, res) {
        try {
            const studentId = req.userId;
            const { noticeId } = req.params;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!noticeId) {
                return res.status(400).json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            const result = await studentNoticeService_js_1.default.getNoticeDetails(studentId, noticeId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getNoticeDetails:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Get notices statistics
    async getStatistics(req, res) {
        try {
            const studentId = req.userId;
            if (!studentId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const result = await studentNoticeService_js_1.default.getNoticesStatistics(studentId);
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
exports.default = new StudentNoticeController();
