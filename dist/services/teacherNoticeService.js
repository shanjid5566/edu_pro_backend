"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
class TeacherNoticeService {
    // Get all notices
    async getAllNotices(page = 1, limit = 10, category, search) {
        try {
            const skip = (page - 1) * limit;
            const actualLimit = Math.min(limit, 100);
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
                    select: {
                        id: true,
                        title: true,
                        message: true,
                        category: true,
                        priority: true,
                        pinned: true,
                        createdAt: true,
                        author: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
                    skip,
                    take: actualLimit,
                }),
                prisma_js_1.prisma.notice.count({ where }),
            ]);
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    message: notice.message,
                    category: notice.category,
                    priority: notice.priority,
                    pinned: notice.pinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    author: notice.author.name,
                })),
                pagination: {
                    page,
                    limit: actualLimit,
                    total,
                    totalPages: Math.ceil(total / actualLimit),
                },
            };
        }
        catch (error) {
            console.error("Error fetching notices:", error);
            throw error;
        }
    }
    // Get notices by category
    async getNoticesByCategory(category) {
        try {
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: { category },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    priority: true,
                    pinned: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    message: notice.message,
                    category: notice.category,
                    priority: notice.priority,
                    pinned: notice.pinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    author: notice.author.name,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching notices by category:", error);
            throw error;
        }
    }
    // Get pinned notices
    async getPinnedNotices() {
        try {
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: { pinned: true },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    priority: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            });
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    message: notice.message,
                    category: notice.category,
                    priority: notice.priority,
                    date: notice.createdAt.toISOString().split("T")[0],
                    author: notice.author.name,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching pinned notices:", error);
            throw error;
        }
    }
    // Get recent notices
    async getRecentNotices(limit = 10) {
        try {
            const actualLimit = Math.min(limit, 100);
            const notices = await prisma_js_1.prisma.notice.findMany({
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    priority: true,
                    pinned: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: actualLimit,
            });
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    message: notice.message,
                    category: notice.category,
                    priority: notice.priority,
                    pinned: notice.pinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    author: notice.author.name,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching recent notices:", error);
            throw error;
        }
    }
    // Get notice by ID
    async getNoticeById(noticeId) {
        try {
            const notice = await prisma_js_1.prisma.notice.findUnique({
                where: { id: noticeId },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    priority: true,
                    pinned: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });
            if (!notice) {
                throw new Error("Notice not found");
            }
            return {
                success: true,
                data: {
                    id: notice.id,
                    title: notice.title,
                    message: notice.message,
                    category: notice.category,
                    priority: notice.priority,
                    pinned: notice.pinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    author: notice.author.name,
                    authorEmail: notice.author.email,
                },
            };
        }
        catch (error) {
            console.error("Error fetching notice:", error);
            throw error;
        }
    }
    // Search notices
    async searchNotices(query) {
        try {
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { message: { contains: query, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    priority: true,
                    pinned: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
                take: 20,
            });
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    message: notice.message,
                    category: notice.category,
                    priority: notice.priority,
                    pinned: notice.pinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    author: notice.author.name,
                })),
            };
        }
        catch (error) {
            console.error("Error searching notices:", error);
            throw error;
        }
    }
    // Get notice statistics
    async getNoticeStatistics() {
        try {
            const [total, pinned, general, exam, event, holiday] = await Promise.all([
                prisma_js_1.prisma.notice.count(),
                prisma_js_1.prisma.notice.count({ where: { pinned: true } }),
                prisma_js_1.prisma.notice.count({ where: { category: "general" } }),
                prisma_js_1.prisma.notice.count({ where: { category: "exam" } }),
                prisma_js_1.prisma.notice.count({ where: { category: "event" } }),
                prisma_js_1.prisma.notice.count({ where: { category: "holiday" } }),
            ]);
            return {
                success: true,
                data: {
                    total,
                    pinned,
                    byCategory: {
                        general,
                        exam,
                        event,
                        holiday,
                    },
                },
            };
        }
        catch (error) {
            console.error("Error fetching notice statistics:", error);
            throw error;
        }
    }
}
exports.default = new TeacherNoticeService();
