"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacherNoticeService_js_1 = __importDefault(require("../services/teacherNoticeService.js"));
class TeacherNoticeController {
    // Get all notices
    async getAllNotices(req, res) {
        try {
            const { page = 1, limit = 10, category, search } = req.query;
            const result = await teacherNoticeService_js_1.default.getAllNotices(Number(page), Number(limit), category, search);
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
    // Get notices by category
    async getNoticesByCategory(req, res) {
        try {
            const { category } = req.params;
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Category is required",
                });
            }
            const validCategories = ["general", "exam", "event", "holiday"];
            if (!validCategories.includes(category.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category. Must be general, exam, event, or holiday",
                });
            }
            const result = await teacherNoticeService_js_1.default.getNoticesByCategory(category);
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
    // Get pinned notices
    async getPinnedNotices(req, res) {
        try {
            const result = await teacherNoticeService_js_1.default.getPinnedNotices();
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
            const { limit = 10 } = req.query;
            const result = await teacherNoticeService_js_1.default.getRecentNotices(Number(limit));
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
    // Get notice by ID
    async getNoticeById(req, res) {
        try {
            const { noticeId } = req.params;
            if (!noticeId) {
                return res.status(400).json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            const result = await teacherNoticeService_js_1.default.getNoticeById(noticeId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error in getNoticeById:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    // Search notices
    async searchNotices(req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
            }
            const result = await teacherNoticeService_js_1.default.searchNotices(query);
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
    // Get notice statistics
    async getStatistics(req, res) {
        try {
            const result = await teacherNoticeService_js_1.default.getNoticeStatistics();
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
exports.default = new TeacherNoticeController();
