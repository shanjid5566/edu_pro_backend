import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import {
  CreateNoticeInput,
  UpdateNoticeInput,
  NoticeResponse,
  NoticeListResponse,
} from "../types/notice.dto.js";

export class NoticeService {
  /**
   * Get all notices with pagination and filters
   */
  async getAllNotices(
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    sortBy: "recent" | "oldest" | "pinned" = "recent"
  ): Promise<NoticeListResponse> {
    const skip = (page - 1) * pageSize;

    // Build where clause for filtering
    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }

    // Get total count
    const total = await db.notice.count({ where });

    // Fetch notices with proper sorting
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "pinned") {
      orderBy = [{ pinned: "desc" }, { createdAt: "desc" }];
    } else if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    const notices = await db.notice.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy,
    });

    return {
      notices: notices as NoticeResponse[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get pinned notices
   */
  async getPinnedNotices(limit: number = 5): Promise<NoticeResponse[]> {
    const notices = await db.notice.findMany({
      where: { pinned: true },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return notices as NoticeResponse[];
  }

  /**
   * Get notices by category
   */
  async getNoticesByCategory(
    category: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<NoticeListResponse> {
    const categoryUpper = category.toUpperCase();
    const validCategories = ["GENERAL", "EXAM", "EVENT", "HOLIDAY"];

    if (!validCategories.includes(categoryUpper)) {
      throw new BadRequestError(
        `Invalid category. Must be one of: ${validCategories.join(", ")}`
      );
    }

    const skip = (page - 1) * pageSize;

    const total = await db.notice.count({
      where: { category: categoryUpper },
    });

    const notices = await db.notice.findMany({
      where: { category: categoryUpper },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return {
      notices: notices as NoticeResponse[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get single notice by ID
   */
  async getNoticeById(id: string): Promise<NoticeResponse> {
    const notice = await db.notice.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!notice) {
      throw new NotFoundError(`Notice with ID ${id} not found`);
    }

    return notice as NoticeResponse;
  }

  /**
   * Create new notice (admin only)
   */
  async createNotice(
    input: CreateNoticeInput,
    userId: string
  ): Promise<NoticeResponse> {
    // Validate required fields
    if (!input.title || !input.title.trim()) {
      throw new BadRequestError("Title is required");
    }

    if (!input.message || !input.message.trim()) {
      throw new BadRequestError("Message is required");
    }

    if (!input.category) {
      throw new BadRequestError("Category is required");
    }

    const validCategories = ["GENERAL", "EXAM", "EVENT", "HOLIDAY"];
    const categoryUpper = input.category.toUpperCase();

    if (!validCategories.includes(categoryUpper)) {
      throw new BadRequestError(
        `Invalid category. Must be one of: ${validCategories.join(", ")}`
      );
    }

    const validPriorities = ["NORMAL", "HIGH", "URGENT"];
    const priority = (input.priority || "NORMAL").toUpperCase();

    if (!validPriorities.includes(priority)) {
      throw new BadRequestError(
        `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
      );
    }

    // Create notice
    const notice = await db.notice.create({
      data: {
        title: input.title.trim(),
        message: input.message.trim(),
        category: categoryUpper,
        priority,
        pinned: input.pinned || false,
        createdBy: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return notice as NoticeResponse;
  }

  /**
   * Update notice (admin only)
   */
  async updateNotice(
    id: string,
    input: UpdateNoticeInput
  ): Promise<NoticeResponse> {
    // Check if notice exists
    const existingNotice = await db.notice.findUnique({ where: { id } });
    if (!existingNotice) {
      throw new NotFoundError(`Notice with ID ${id} not found`);
    }

    // Validate category if provided
    if (input.category) {
      const validCategories = ["GENERAL", "EXAM", "EVENT", "HOLIDAY"];
      const categoryUpper = input.category.toUpperCase();

      if (!validCategories.includes(categoryUpper)) {
        throw new BadRequestError(
          `Invalid category. Must be one of: ${validCategories.join(", ")}`
        );
      }
    }

    // Validate priority if provided
    if (input.priority) {
      const validPriorities = ["NORMAL", "HIGH", "URGENT"];
      const priorityUpper = input.priority.toUpperCase();

      if (!validPriorities.includes(priorityUpper)) {
        throw new BadRequestError(
          `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
        );
      }
    }

    // Prepare update data (exclude undefined values)
    const updateData: any = {};
    if (input.title !== undefined) {
      updateData.title = input.title.trim();
    }
    if (input.message !== undefined) {
      updateData.message = input.message.trim();
    }
    if (input.category !== undefined) {
      updateData.category = input.category.toUpperCase();
    }
    if (input.priority !== undefined) {
      updateData.priority = input.priority.toUpperCase();
    }
    if (input.pinned !== undefined) {
      updateData.pinned = input.pinned;
    }

    // Update notice
    const notice = await db.notice.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return notice as NoticeResponse;
  }

  /**
   * Pin or unpin notice (admin only)
   */
  async togglePinNotice(id: string, pinned: boolean): Promise<NoticeResponse> {
    // Check if notice exists
    const notice = await db.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new NotFoundError(`Notice with ID ${id} not found`);
    }

    // Update pinned status
    const updatedNotice = await db.notice.update({
      where: { id },
      data: { pinned },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return updatedNotice as NoticeResponse;
  }

  /**
   * Delete notice (admin only)
   */
  async deleteNotice(id: string): Promise<void> {
    // Check if notice exists
    const notice = await db.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new NotFoundError(`Notice with ID ${id} not found`);
    }

    // Delete notice
    await db.notice.delete({ where: { id } });
  }

  /**
   * Search notices by title or message
   */
  async searchNotices(
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<NoticeListResponse> {
    if (!query || !query.trim()) {
      throw new BadRequestError("Search query cannot be empty");
    }

    const skip = (page - 1) * pageSize;
    const searchQuery = query.trim().toLowerCase();

    const total = await db.notice.count({
      where: {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { message: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
    });

    const notices = await db.notice.findMany({
      where: {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { message: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return {
      notices: notices as NoticeResponse[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

export const noticeService = new NoticeService();
