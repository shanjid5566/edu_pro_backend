import { prisma } from "../lib/prisma.js";

class ParentChildNoticesService {
  // Get all notices for child
  async getAllNotices(parentId: string, studentId: string, limit: number = 20, offset: number = 0) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const notices = await (prisma as any).notice.findMany({
        where: {
          classId: (await (prisma as any).student.findUnique({ where: { id: studentId } })).classId,
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

      const total = await (prisma as any).notice.count({
        where: {
          classId: (await (prisma as any).student.findUnique({ where: { id: studentId } })).classId,
        },
      });

      return {
        success: true,
        data: notices.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          description: notice.description,
          category: notice.category,
          isPinned: notice.isPinned,
          date: notice.createdAt.toISOString().split("T")[0],
          by: notice.createdBy,
          timeAgo: this.getTimeAgo(notice.createdAt),
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error("Error fetching all notices:", error);
      throw error;
    }
  }

  // Get pinned notices
  async getPinnedNotices(parentId: string, studentId: string) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await (prisma as any).student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      const pinnedNotices = await (prisma as any).notice.findMany({
        where: {
          classId: student.classId,
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
        data: pinnedNotices.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          description: notice.description,
          category: notice.category,
          date: notice.createdAt.toISOString().split("T")[0],
          by: notice.createdBy,
          isPinned: true,
        })),
      };
    } catch (error) {
      console.error("Error fetching pinned notices:", error);
      throw error;
    }
  }

  // Get notices by category
  async getNoticesByCategory(parentId: string, studentId: string, category: string) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await (prisma as any).student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      const validCategories = ["GENERAL", "EXAM", "EVENT", "HOLIDAY", "IMPORTANT"];
      if (!validCategories.includes(category.toUpperCase())) {
        throw new Error(
          "Invalid category. Must be GENERAL, EXAM, EVENT, HOLIDAY, or IMPORTANT"
        );
      }

      const notices = await (prisma as any).notice.findMany({
        where: {
          classId: student.classId,
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
          notices: notices.map((notice: any) => ({
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
    } catch (error) {
      console.error("Error fetching notices by category:", error);
      throw error;
    }
  }

  // Get recent notices
  async getRecentNotices(parentId: string, studentId: string, days: number = 7) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await (prisma as any).student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const recentNotices = await (prisma as any).notice.findMany({
        where: {
          classId: student.classId,
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
          notices: recentNotices.map((notice: any) => ({
            id: notice.id,
            title: notice.title,
            description: notice.description,
            category: notice.category,
            isPinned: notice.isPinned,
            date: notice.createdAt.toISOString().split("T")[0],
            by: notice.createdBy,
            timeAgo: this.getTimeAgo(notice.createdAt),
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching recent notices:", error);
      throw error;
    }
  }

  // Get notice details
  async getNoticeDetails(parentId: string, studentId: string, noticeId: string) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await (prisma as any).student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      const notice = await (prisma as any).notice.findUnique({
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

      if (!notice || notice.classId !== student.classId) {
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
    } catch (error) {
      console.error("Error fetching notice details:", error);
      throw error;
    }
  }

  // Get notice statistics
  async getNoticeStatistics(parentId: string, studentId: string) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await (prisma as any).student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      const notices = await (prisma as any).notice.findMany({
        where: { classId: student.classId },
        select: { category: true, isPinned: true },
      });

      const stats: Record<string, number> = {
        GENERAL: 0,
        EXAM: 0,
        EVENT: 0,
        HOLIDAY: 0,
        IMPORTANT: 0,
        pinned: 0,
        total: notices.length,
      };

      notices.forEach((notice: any) => {
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
    } catch (error) {
      console.error("Error fetching notice statistics:", error);
      throw error;
    }
  }

  // Search notices
  async searchNotices(parentId: string, studentId: string, query: string) {
    try {
      // Verify parent-child relationship
      const parentStudent = await (prisma as any).parentStudent.findFirst({
        where: {
          parentId: parentId,
          studentId: studentId,
        },
      });

      if (!parentStudent) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await (prisma as any).student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      const notices = await (prisma as any).notice.findMany({
        where: {
          classId: student.classId,
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
          results: notices.map((notice: any) => ({
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
    } catch (error) {
      console.error("Error searching notices:", error);
      throw error;
    }
  }

  // Helper function to calculate time ago
  private getTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toISOString().split("T")[0];
  }
}

export default new ParentChildNoticesService();
