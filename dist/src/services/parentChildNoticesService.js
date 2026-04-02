"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
const dateUtils_js_1 = require("../utils/dateUtils.js");
class ParentChildNoticesService {
    async resolveParentId(userId) {
        const parent = await prisma_js_1.prisma.parent.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!parent) {
            throw new Error("Parent not found");
        }
        return parent.id;
    }
    async resolveAuthorizedStudentId(parentId, studentOrEnrollmentId) {
        const relation = await prisma_js_1.prisma.parentStudent.findFirst({
            where: {
                parentId,
                OR: [
                    { studentId: studentOrEnrollmentId },
                    { id: studentOrEnrollmentId },
                ],
            },
            select: { studentId: true },
        });
        if (!relation) {
            throw new Error("Unauthorized: Child not found for this parent");
        }
        return relation.studentId;
    }
    // Get all notices for child
    async getAllNotices(userId, studentId, limit = 20, offset = 0) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
            const notices = await prisma_js_1.prisma.notice.findMany({
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    pinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
                take: limit,
                skip: offset,
            });
            const total = await prisma_js_1.prisma.notice.count();
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    description: notice.message,
                    category: notice.category,
                    isPinned: notice.pinned,
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
    async getPinnedNotices(userId, studentId) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
            const pinnedNotices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    pinned: true,
                },
                select: {
                    id: true,
                    title: true,
                    message: true,
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
                    description: notice.message,
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
    async getNoticesByCategory(userId, studentId, category) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
            const normalizedCategory = category.toLowerCase();
            const validCategories = ["general", "exam", "event", "holiday", "important"];
            if (!validCategories.includes(normalizedCategory)) {
                throw new Error("Invalid category. Must be general, exam, event, holiday, or important");
            }
            const notices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    category: {
                        equals: normalizedCategory,
                        mode: "insensitive",
                    },
                },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    pinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: {
                    category,
                    count: notices.length,
                    notices: notices.map((notice) => ({
                        id: notice.id,
                        title: notice.title,
                        description: notice.message,
                        category: notice.category,
                        isPinned: notice.pinned,
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
    async getRecentNotices(userId, studentId, days = 7) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const recentNotices = await prisma_js_1.prisma.notice.findMany({
                where: {
                    createdAt: { gte: startDate },
                },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    pinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: {
                    days,
                    count: recentNotices.length,
                    notices: recentNotices.map((notice) => ({
                        id: notice.id,
                        title: notice.title,
                        description: notice.message,
                        category: notice.category,
                        isPinned: notice.pinned,
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
    async getNoticeDetails(userId, studentId, noticeId) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
            const notice = await prisma_js_1.prisma.notice.findUnique({
                where: { id: noticeId },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    pinned: true,
                    createdAt: true,
                    createdBy: true,
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
                    description: notice.message,
                    category: notice.category,
                    isPinned: notice.pinned,
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
    async getNoticeStatistics(userId, studentId) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
            const notices = await prisma_js_1.prisma.notice.findMany({
                select: { category: true, pinned: true },
            });
            const stats = {
                general: 0,
                exam: 0,
                event: 0,
                holiday: 0,
                important: 0,
                pinned: 0,
                total: notices.length,
            };
            notices.forEach((notice) => {
                const key = String(notice.category || "").toLowerCase();
                if (key in stats) {
                    stats[key]++;
                }
                if (notice.pinned) {
                    stats.pinned++;
                }
            });
            return {
                success: true,
                data: {
                    totalNotices: stats.total,
                    byCategory: {
                        general: stats.general,
                        exam: stats.exam,
                        event: stats.event,
                        holiday: stats.holiday,
                        important: stats.important,
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
    async searchNotices(userId, studentId, query) {
        try {
            const parentId = await this.resolveParentId(userId);
            await this.resolveAuthorizedStudentId(parentId, studentId);
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
                    pinned: true,
                    createdAt: true,
                    createdBy: true,
                },
                orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
            });
            return {
                success: true,
                data: {
                    query,
                    count: notices.length,
                    results: notices.map((notice) => ({
                        id: notice.id,
                        title: notice.title,
                        description: notice.message,
                        category: notice.category,
                        isPinned: notice.pinned,
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
