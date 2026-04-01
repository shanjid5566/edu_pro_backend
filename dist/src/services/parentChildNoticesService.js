"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
const dateUtils_js_1 = require("../utils/dateUtils.js");
const parentAccess_js_1 = require("../utils/parentAccess.js");
class ParentChildNoticesService {
    // Get all notices for child
    async getAllNotices(parentId, studentId, limit = 20, offset = 0) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    classId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    isPinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
                take: limit,
                skip: offset,
            });
            const total = await prisma_js_1.prisma.notice.count({
                where: {
                    classId,
                },
            });
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    description: notice.description,
                    category: notice.category,
                    isPinned: notice.isPinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    by: notice.createdBy,
                    timeAgo: (0, dateUtils_js_1.getTimeAgo)(notice.createdAt),
                })),
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total,
                },
            };
        }
        catch (error) {
            console.error("Error fetching all notices:", error);
            throw error;
        }
    }
    // Get pinned notices
    async getPinnedNotices(parentId, studentId) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const pinnedNotices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    classId,
                    isPinned: true,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            });
            return {
                success: true,
                data: pinnedNotices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    description: notice.description,
                    category: notice.category,
                    date: notice.createdAt.toISOString().split("T")[0],
                    by: notice.createdBy,
                    isPinned: true,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching pinned notices:", error);
            throw error;
        }
    }
    // Get notices by category
    async getNoticesByCategory(parentId, studentId, category) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const validCategories = ["GENERAL", "EXAM", "EVENT", "HOLIDAY", "IMPORTANT"];
            if (!validCategories.includes(category.toUpperCase())) {
                throw new Error("Invalid category. Must be GENERAL, EXAM, EVENT, HOLIDAY, or IMPORTANT");
            }
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    classId,
                    category: category.toUpperCase(),
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    isPinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: {
                    category,
                    count: notices.length,
                    notices: notices.map((notice) => ({
                        id: notice.id,
                        title: notice.title,
                        description: notice.description,
                        category: notice.category,
                        isPinned: notice.isPinned,
                        date: notice.createdAt.toISOString().split("T")[0],
                        by: notice.createdBy,
                    })),
                },
            };
        }
        catch (error) {
            console.error("Error fetching notices by category:", error);
            throw error;
        }
    }
    // Get recent notices
    async getRecentNotices(parentId, studentId, days = 7) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const recentNotices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    classId,
                    createdAt: { gte: startDate },
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    isPinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: {
                    days,
                    count: recentNotices.length,
                    notices: recentNotices.map((notice) => ({
                        id: notice.id,
                        title: notice.title,
                        description: notice.description,
                        category: notice.category,
                        isPinned: notice.isPinned,
                        date: notice.createdAt.toISOString().split("T")[0],
                        by: notice.createdBy,
                        timeAgo: (0, dateUtils_js_1.getTimeAgo)(notice.createdAt),
                    })),
                },
            };
        }
        catch (error) {
            console.error("Error fetching recent notices:", error);
            throw error;
        }
    }
    // Get notice details
    async getNoticeDetails(parentId, studentId, noticeId) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const notice = await prisma_js_1.prisma.notice.findUnique({
                where: { id: noticeId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    isPinned: true,
                    createdAt: true,
                    createdBy: true,
                    classId: true,
                },
            });
            if (!notice || notice.classId !== classId) {
                throw new Error("Notice not found or not accessible");
            }
            return {
                success: true,
                data: {
                    id: notice.id,
                    title: notice.title,
                    description: notice.description,
                    category: notice.category,
                    isPinned: notice.isPinned,
                    date: notice.createdAt.toISOString().split("T")[0],
                    by: notice.createdBy,
                    fullDate: notice.createdAt.toISOString(),
                },
            };
        }
        catch (error) {
            console.error("Error fetching notice details:", error);
            throw error;
        }
    }
    // Get notice statistics
    async getNoticeStatistics(parentId, studentId) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: { classId },
                select: { category: true, isPinned: true },
            });
            const stats = {
                GENERAL: 0,
                EXAM: 0,
                EVENT: 0,
                HOLIDAY: 0,
                IMPORTANT: 0,
                pinned: 0,
                total: notices.length,
            };
            notices.forEach((notice) => {
                if (notice.category in stats) {
                    stats[notice.category]++;
                }
                if (notice.isPinned) {
                    stats.pinned++;
                }
            });
            return {
                success: true,
                data: {
                    totalNotices: stats.total,
                    byCategory: {
                        general: stats.GENERAL,
                        exam: stats.EXAM,
                        event: stats.EVENT,
                        holiday: stats.HOLIDAY,
                        important: stats.IMPORTANT,
                    },
                    pinnedCount: stats.pinned,
                },
            };
        }
        catch (error) {
            console.error("Error fetching notice statistics:", error);
            throw error;
        }
    }
    // Search notices
    async searchNotices(parentId, studentId, query) {
        try {
            await (0, parentAccess_js_1.assertParentStudentAccess)(parentId, studentId);
            const classId = await (0, parentAccess_js_1.getStudentClassId)(studentId);
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    classId,
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    isPinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: {
                    query,
                    count: notices.length,
                    results: notices.map((notice) => ({
                        id: notice.id,
                        title: notice.title,
                        description: notice.description,
                        category: notice.category,
                        isPinned: notice.isPinned,
                        date: notice.createdAt.toISOString().split("T")[0],
                        by: notice.createdBy,
                    })),
                },
            };
        }
        catch (error) {
            console.error("Error searching notices:", error);
            throw error;
        }
    }
}
exports.default = new ParentChildNoticesService();
