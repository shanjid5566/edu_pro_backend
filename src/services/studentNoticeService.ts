import { prisma } from "../lib/prisma.js";

class StudentNoticeService {
  // Get all notices
  async getAllNotices(studentId: string, limit: number = 50, offset: number = 0) {
    try {
      const notices = await prisma.notice.findMany({
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
          category: true,
          pinned: true,
          createdBy: true,
        },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      });

      const total = await prisma.notice.count();

      return {
        success: true,
        data: notices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          message: notice.message,
          date: notice.createdAt.toISOString().split("T")[0],
          category: notice.category,
          pinned: notice.pinned,
          createdBy: notice.createdBy,
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
  async getPinnedNotices(studentId: string) {
    try {
      const pinnedNotices = await prisma.notice.findMany({
        where: { pinned: true },
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
          category: true,
          createdBy: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        success: true,
        data: pinnedNotices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          message: notice.message,
          date: notice.createdAt.toISOString().split("T")[0],
          category: notice.category,
          createdBy: notice.createdBy,
        })),
      };
    } catch (error) {
      console.error("Error fetching pinned notices:", error);
      throw error;
    }
  }

  // Get recent notices
  async getRecentNotices(studentId: string, limit: number = 10) {
    try {
      const recentNotices = await prisma.notice.findMany({
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
          category: true,
          pinned: true,
          createdBy: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: recentNotices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          message: notice.message,
          date: notice.createdAt.toISOString().split("T")[0],
          category: notice.category,
          pinned: notice.pinned,
          createdBy: notice.createdBy,
        })),
      };
    } catch (error) {
      console.error("Error fetching recent notices:", error);
      throw error;
    }
  }

  // Get notices by category
  async getNoticesByCategory(
    studentId: string,
    category: string,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      const validCategories = ["General", "Exam", "Event", "Holiday"];
      if (!validCategories.includes(category)) {
        throw new Error(
          `Invalid category. Must be one of: ${validCategories.join(", ")}`
        );
      }

      const notices = await prisma.notice.findMany({
        where: { category },
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
          category: true,
          pinned: true,
          createdBy: true,
        },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      });

      const total = await prisma.notice.count({ where: { category } });

      return {
        success: true,
        data: notices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          message: notice.message,
          date: notice.createdAt.toISOString().split("T")[0],
          category: notice.category,
          pinned: notice.pinned,
          createdBy: notice.createdBy,
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error("Error fetching notices by category:", error);
      throw error;
    }
  }

  // Search notices
  async searchNotices(
    studentId: string,
    keyword: string,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      const notices = await prisma.notice.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { message: { contains: keyword, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
          category: true,
          pinned: true,
          createdBy: true,
        },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      });

      const total = await prisma.notice.count({
        where: {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { message: { contains: keyword, mode: "insensitive" } },
          ],
        },
      });

      return {
        success: true,
        data: notices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          message: notice.message,
          date: notice.createdAt.toISOString().split("T")[0],
          category: notice.category,
          pinned: notice.pinned,
          createdBy: notice.createdBy,
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error("Error searching notices:", error);
      throw error;
    }
  }

  // Get notice details
  async getNoticeDetails(studentId: string, noticeId: string) {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id: noticeId },
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
          category: true,
          pinned: true,
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
          message: notice.message,
          date: notice.createdAt.toISOString().split("T")[0],
          category: notice.category,
          pinned: notice.pinned,
          createdBy: notice.createdBy,
        },
      };
    } catch (error) {
      console.error("Error fetching notice details:", error);
      throw error;
    }
  }

  // Get notices statistics
  async getNoticesStatistics(studentId: string) {
    try {
      const totalNotices = await prisma.notice.count();
      const pinnedNotices = await prisma.notice.count({ where: { pinned: true } });

      const noticesByCategory = await prisma.notice.groupBy({
        by: ["category"],
        _count: true,
      });

      const categoryStats = noticesByCategory.map((cat) => ({
        category: cat.category,
        count: cat._count,
      }));

      return {
        success: true,
        data: {
          totalNotices,
          pinnedNotices,
          categoryBreakdown: categoryStats,
        },
      };
    } catch (error) {
      console.error("Error fetching notices statistics:", error);
      throw error;
    }
  }
}

export default new StudentNoticeService();
