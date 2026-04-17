"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminNoticeService = exports.AdminNoticeService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
class AdminNoticeService {
    // Get all notices with pagination and filters
    async getAllNotices(page = 1, limit = 10, category, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (category && category !== "all") {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } },
            ];
        }
        const [notices, total] = await Promise.all([
            prisma_js_1.prisma.notice.findMany({
                where,
                include: { author: { select: { id: true, name: true, email: true } } },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
                skip,
                take: limit,
            }),
            prisma_js_1.prisma.notice.count({ where }),
        ]);
        return {
            data: notices,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    // Get notices by category
    async getNoticesByCategory(category) {
        return await prisma_js_1.prisma.notice.findMany({
            where: { category: category.toLowerCase() },
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        });
    }
    // Get pinned notices
    async getPinnedNotices() {
        return await prisma_js_1.prisma.notice.findMany({
            where: { pinned: true },
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get recent notices
    async getRecentNotices(limit = 5) {
        return await prisma_js_1.prisma.notice.findMany({
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
    // Get single notice
    async getNoticeById(id) {
        const notice = await prisma_js_1.prisma.notice.findUnique({
            where: { id },
            include: { author: { select: { id: true, name: true, email: true } } },
        });
        if (!notice) {
            throw new Error("Notice not found");
        }
        return notice;
    }
    // Create notice (Admin only)
    async createNotice(input) {
        // Validate required fields
        if (!input.title || !input.message || !input.category) {
            throw new Error("Title, message, and category are required");
        }
        // Validate category
        const validCategories = ["general", "exam", "event", "holiday"];
        if (!validCategories.includes(input.category)) {
            throw new Error("Invalid category. Must be one of: general, exam, event, holiday");
        }
        return await prisma_js_1.prisma.notice.create({
            data: {
                title: input.title.trim(),
                message: input.message.trim(),
                category: input.category,
                priority: input.priority || "normal",
                pinned: input.pinned || false,
                createdBy: input.createdBy,
            },
            include: { author: { select: { id: true, name: true, email: true } } },
        });
    }
    // Update notice (Admin only)
    async updateNotice(id, input) {
        const notice = await prisma_js_1.prisma.notice.findUnique({ where: { id } });
        if (!notice) {
            throw new Error("Notice not found");
        }
        if (input.category) {
            const validCategories = ["general", "exam", "event", "holiday"];
            if (!validCategories.includes(input.category)) {
                throw new Error("Invalid category. Must be one of: general, exam, event, holiday");
            }
        }
        return await prisma_js_1.prisma.notice.update({
            where: { id },
            data: {
                title: input.title?.trim(),
                message: input.message?.trim(),
                category: input.category,
                priority: input.priority,
                pinned: input.pinned,
            },
            include: { author: { select: { id: true, name: true, email: true } } },
        });
    }
    // Delete notice (Admin only)
    async deleteNotice(id) {
        const notice = await prisma_js_1.prisma.notice.findUnique({ where: { id } });
        if (!notice) {
            throw new Error("Notice not found");
        }
        await prisma_js_1.prisma.notice.delete({ where: { id } });
        return { message: "Notice deleted successfully" };
    }
    // Search notices
    async searchNotices(query) {
        return await prisma_js_1.prisma.notice.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { message: { contains: query, mode: "insensitive" } },
                ],
            },
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        });
    }
    // Get notice statistics
    async getNoticeStatistics() {
        const categories = ["general", "exam", "event", "holiday"];
        const stats = await Promise.all(categories.map(async (category) => ({
            category,
            count: await prisma_js_1.prisma.notice.count({ where: { category } }),
        })));
        const total = await prisma_js_1.prisma.notice.count();
        const pinnedCount = await prisma_js_1.prisma.notice.count({ where: { pinned: true } });
        return {
            total,
            pinnedCount,
            byCategory: stats,
        };
    }
    // Pin/Unpin notice (Admin only)
    async togglePinNotice(id) {
        const notice = await prisma_js_1.prisma.notice.findUnique({ where: { id } });
        if (!notice) {
            throw new Error("Notice not found");
        }
        return await prisma_js_1.prisma.notice.update({
            where: { id },
            data: { pinned: !notice.pinned },
            include: { author: { select: { id: true, name: true, email: true } } },
        });
    }
}
exports.AdminNoticeService = AdminNoticeService;
exports.adminNoticeService = new AdminNoticeService();
