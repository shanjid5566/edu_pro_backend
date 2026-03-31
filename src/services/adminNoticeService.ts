import { prisma } from "../lib/prisma.js";

interface CreateNoticeInput {
  title: string;
  message: string;
  category: "general" | "exam" | "event" | "holiday";
  priority?: "normal" | "high" | "urgent";
  pinned?: boolean;
  createdBy: string;
}

interface UpdateNoticeInput {
  title?: string;
  message?: string;
  category?: "general" | "exam" | "event" | "holiday";
  priority?: "normal" | "high" | "urgent";
  pinned?: boolean;
}

export class AdminNoticeService {
  // Get all notices with pagination and filters
  async getAllNotices(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
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
      prisma.notice.findMany({
        where,
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.notice.count({ where }),
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
  async getNoticesByCategory(category: string) {
    return await prisma.notice.findMany({
      where: { category: category.toLowerCase() },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });
  }

  // Get pinned notices
  async getPinnedNotices() {
    return await prisma.notice.findMany({
      where: { pinned: true },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get recent notices
  async getRecentNotices(limit: number = 5) {
    return await prisma.notice.findMany({
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // Get single notice
  async getNoticeById(id: string) {
    const notice = await prisma.notice.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!notice) {
      throw new Error("Notice not found");
    }

    return notice;
  }

  // Create notice (Admin only)
  async createNotice(input: CreateNoticeInput) {
    // Validate required fields
    if (!input.title || !input.message || !input.category) {
      throw new Error("Title, message, and category are required");
    }

    // Validate category
    const validCategories = ["general", "exam", "event", "holiday"];
    if (!validCategories.includes(input.category)) {
      throw new Error(
        "Invalid category. Must be one of: general, exam, event, holiday"
      );
    }

    return await prisma.notice.create({
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
  async updateNotice(id: string, input: UpdateNoticeInput) {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new Error("Notice not found");
    }

    if (input.category) {
      const validCategories = ["general", "exam", "event", "holiday"];
      if (!validCategories.includes(input.category)) {
        throw new Error(
          "Invalid category. Must be one of: general, exam, event, holiday"
        );
      }
    }

    return await prisma.notice.update({
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
  async deleteNotice(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new Error("Notice not found");
    }

    await prisma.notice.delete({ where: { id } });
    return { message: "Notice deleted successfully" };
  }

  // Search notices
  async searchNotices(query: string) {
    return await prisma.notice.findMany({
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

    const stats = await Promise.all(
      categories.map(async (category) => ({
        category,
        count: await prisma.notice.count({ where: { category } }),
      }))
    );

    const total = await prisma.notice.count();
    const pinnedCount = await prisma.notice.count({ where: { pinned: true } });

    return {
      total,
      pinnedCount,
      byCategory: stats,
    };
  }

  // Pin/Unpin notice (Admin only)
  async togglePinNotice(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new Error("Notice not found");
    }

    return await prisma.notice.update({
      where: { id },
      data: { pinned: !notice.pinned },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }
}

export const adminNoticeService = new AdminNoticeService();
