import { prisma } from "../lib/prisma.js";
import { getTimeAgo } from "../utils/dateUtils.js";

class ParentChildNoticesService {
  private async resolveParentId(userId: string): Promise<string> {
    const parent = await prisma.parent.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!parent) {
      throw new Error("Parent not found");
    }

    return parent.id;
  }

  private async resolveAuthorizedStudentId(
    parentId: string,
    studentOrEnrollmentId: string
  ): Promise<string> {
    const relation = await prisma.parentStudent.findFirst({
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
  async getAllNotices(userId: string, studentId: string, limit: number = 20, offset: number = 0) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const notices = await (prisma as any).notice.findMany({
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

      const total = await (prisma as any).notice.count();

      return {
        success: true,
        data: notices.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          description: notice.message,
          category: notice.category,
          isPinned: notice.pinned,
          date: notice.createdAt.toISOString().split("T")[0],
          by: notice.createdBy,
          timeAgo: getTimeAgo(notice.createdAt),
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
  async getPinnedNotices(userId: string, studentId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const pinnedNotices = await (prisma as any).notice.findMany({
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
        data: pinnedNotices.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          description: notice.message,
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
  async getNoticesByCategory(userId: string, studentId: string, category: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const normalizedCategory = category.toLowerCase();
      const validCategories = ["general", "exam", "event", "holiday", "important"];
      if (!validCategories.includes(normalizedCategory)) {
        throw new Error(
          "Invalid category. Must be general, exam, event, holiday, or important"
        );
      }

      const notices = await (prisma as any).notice.findMany({
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
          notices: notices.map((notice: any) => ({
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
    } catch (error) {
      console.error("Error fetching notices by category:", error);
      throw error;
    }
  }

  // Get recent notices
  async getRecentNotices(userId: string, studentId: string, days: number = 7) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const recentNotices = await (prisma as any).notice.findMany({
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
          notices: recentNotices.map((notice: any) => ({
            id: notice.id,
            title: notice.title,
            description: notice.message,
            category: notice.category,
            isPinned: notice.pinned,
            date: notice.createdAt.toISOString().split("T")[0],
            by: notice.createdBy,
            timeAgo: getTimeAgo(notice.createdAt),
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching recent notices:", error);
      throw error;
    }
  }

  // Get notice details
  async getNoticeDetails(userId: string, studentId: string, noticeId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const notice = await (prisma as any).notice.findUnique({
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
    } catch (error) {
      console.error("Error fetching notice details:", error);
      throw error;
    }
  }

  // Get notice statistics
  async getNoticeStatistics(userId: string, studentId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const notices = await (prisma as any).notice.findMany({
        select: { category: true, pinned: true },
      });

      const stats: Record<string, number> = {
        general: 0,
        exam: 0,
        event: 0,
        holiday: 0,
        important: 0,
        pinned: 0,
        total: notices.length,
      };

      notices.forEach((notice: any) => {
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
    } catch (error) {
      console.error("Error fetching notice statistics:", error);
      throw error;
    }
  }

  // Search notices
  async searchNotices(userId: string, studentId: string, query: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      await this.resolveAuthorizedStudentId(parentId, studentId);

      const notices = await (prisma as any).notice.findMany({
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
          results: notices.map((notice: any) => ({
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
    } catch (error) {
      console.error("Error searching notices:", error);
      throw error;
    }
  }

}

export default new ParentChildNoticesService();
