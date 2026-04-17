"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminNoticeController = exports.AdminNoticeController = void 0;
const adminNoticeService_js_1 = require("../services/adminNoticeService.js");
const queryParams_js_1 = require("../utils/queryParams.js");
class AdminNoticeController {
    // Get all notices (public)
    async getAllNotices(req, res) {
        try {
            const page = (0, queryParams_js_1.getQueryNumber)(req.query.page, 1);
            const limit = (0, queryParams_js_1.getQueryNumber)(req.query.limit, 10);
            const category = (0, queryParams_js_1.getQueryString)(req.query.category);
            const search = (0, queryParams_js_1.getQueryString)(req.query.search);
            const result = await adminNoticeService_js_1.adminNoticeService.getAllNotices(page, limit, category, search);
            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Get notices by category (public)
    async getNoticesByCategory(req, res) {
        try {
            const { category } = req.params;
            if (!category) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: "Category is required",
                });
            }
            const notices = await adminNoticeService_js_1.adminNoticeService.getNoticesByCategory(category);
            return res.status(200).json({
                success: true,
                data: notices,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Get pinned notices (public)
    async getPinnedNotices(req, res) {
        try {
            const notices = await adminNoticeService_js_1.adminNoticeService.getPinnedNotices();
            return res.status(200).json({
                success: true,
                data: notices,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Get recent notices (public)
    async getRecentNotices(req, res) {
        try {
            const { limit = 5 } = req.query;
            const notices = await adminNoticeService_js_1.adminNoticeService.getRecentNotices(Number(limit));
            return res.status(200).json({
                success: true,
                data: notices,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Get single notice (public)
    async getNoticeById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            const notice = await adminNoticeService_js_1.adminNoticeService.getNoticeById(id);
            return res.status(200).json({
                success: true,
                data: notice,
            });
        }
        catch (error) {
            return res.status(error.message === "Notice not found" ? 404 : 500).json({
                success: false,
                message: error.message || "Server error",
            });
        }
    }
    // Create notice (Admin only)
    async createNotice(req, res) {
        try {
            const { title, message, category, priority, pinned } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }
            const notice = await adminNoticeService_js_1.adminNoticeService.createNotice({
                title,
                message,
                category,
                priority,
                pinned,
                createdBy: userId,
            });
            return res.status(201).json({
                success: true,
                message: "Notice created successfully",
                data: notice,
            });
        }
        catch (error) {
            return res
                .status(400)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Update notice (Admin only)
    async updateNotice(req, res) {
        try {
            const { id } = req.params;
            const { title, message, category, priority, pinned } = req.body;
            if (!id) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            const notice = await adminNoticeService_js_1.adminNoticeService.updateNotice(id, {
                title,
                message,
                category,
                priority,
                pinned,
            });
            return res.status(200).json({
                success: true,
                message: "Notice updated successfully",
                data: notice,
            });
        }
        catch (error) {
            return res
                .status(error.message === "Notice not found" ? 404 : 400)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Delete notice (Admin only)
    async deleteNotice(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            await adminNoticeService_js_1.adminNoticeService.deleteNotice(id);
            return res.status(200).json({
                success: true,
                message: "Notice deleted successfully",
            });
        }
        catch (error) {
            return res
                .status(error.message === "Notice not found" ? 404 : 500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Search notices (public)
    async searchNotices(req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: "Search query is required",
                });
            }
            const notices = await adminNoticeService_js_1.adminNoticeService.searchNotices(query);
            return res.status(200).json({
                success: true,
                data: notices,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Get notice statistics (public)
    async getNoticeStatistics(req, res) {
        try {
            const stats = await adminNoticeService_js_1.adminNoticeService.getNoticeStatistics();
            return res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
    // Toggle pin notice (Admin only)
    async togglePinNotice(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .json({
                    success: false,
                    message: "Notice ID is required",
                });
            }
            const notice = await adminNoticeService_js_1.adminNoticeService.togglePinNotice(id);
            return res.status(200).json({
                success: true,
                message: `Notice ${notice.pinned ? "pinned" : "unpinned"} successfully`,
                data: notice,
            });
        }
        catch (error) {
            return res
                .status(error.message === "Notice not found" ? 404 : 500)
                .json({ success: false, message: error.message || "Server error" });
        }
    }
}
exports.AdminNoticeController = AdminNoticeController;
exports.adminNoticeController = new AdminNoticeController();
