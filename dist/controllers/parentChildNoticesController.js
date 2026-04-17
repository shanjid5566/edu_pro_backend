"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parentChildNoticesService_js_1 = __importDefault(require("../services/parentChildNoticesService.js"));
class ParentChildNoticesController {
    // Get all notices
    async getAllNotices(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const { limit, offset } = req.query;
            const limitParam = limit ? parseInt(limit) : 20;
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
            const result = await parentChildNoticesService_js_1.default.getAllNotices(parentId, studentId, limitParam, offsetParam);
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
            const result = await parentChildNoticesService_js_1.default.getPinnedNotices(parentId, studentId);
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
    // Get notices by category
    async getNoticesByCategory(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const category = req.params.category;
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
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Category is required",
                });
            }
            const result = await parentChildNoticesService_js_1.default.getNoticesByCategory(parentId, studentId, category);
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
    // Get recent notices
    async getRecentNotices(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const { days } = req.query;
            const daysParam = days ? parseInt(days) : 7;
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
            const result = await parentChildNoticesService_js_1.default.getRecentNotices(parentId, studentId, daysParam);
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
    // Get notice details
    async getNoticeDetails(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const noticeId = req.params.noticeId;
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
            if (!noticeId) {
                return res.status(400).json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            const result = await parentChildNoticesService_js_1.default.getNoticeDetails(parentId, studentId, noticeId);
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
    // Get notice statistics
    async getNoticeStatistics(req, res) {
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
            const result = await parentChildNoticesService_js_1.default.getNoticeStatistics(parentId, studentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getNoticeStatistics:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Search notices
    async searchNotices(req, res) {
        try {
            const parentId = req.userId;
            const studentId = req.params.studentId;
            const { query } = req.query;
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
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
            }
            const result = await parentChildNoticesService_js_1.default.searchNotices(parentId, studentId, query);
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
}
exports.default = new ParentChildNoticesController();
