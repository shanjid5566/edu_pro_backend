import { Request, Response } from "express";
import { noticeService } from "../services/notice.service.js";
import { ValidationError, BadRequestError } from "../utils/errors.js";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export class NoticeController {
  /**
   * GET /api/v1/notices
   * Get all notices with pagination and filters
   */
  async getAllNotices(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      const categoryParam = String(Array.isArray(req.query.category) ? req.query.category[0] : req.query.category || "");
      const sortByParam = String(Array.isArray(req.query.sortBy) ? req.query.sortBy[0] : req.query.sortBy || "");
      
      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;
      const category = categoryParam || undefined;
      const sortBy = (sortByParam as "recent" | "oldest" | "pinned") || "recent";

      // Validate pagination
      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await noticeService.getAllNotices(
        page,
        pageSize,
        category,
        sortBy
      );

      res.json({
        success: true,
        message: "Notices retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to retrieve notices";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/notices/pinned
   * Get pinned notices
   */
  async getPinnedNotices(req: Request, res: Response): Promise<void> {
    try {
      const limitParam = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit || "");
      const limit = parseInt(limitParam || "5") || 5;

      const notices = await noticeService.getPinnedNotices(limit);

      res.json({
        success: true,
        message: "Pinned notices retrieved successfully",
        data: {
          notices,
          count: notices.length,
        },
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to retrieve pinned notices";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/notices/category/:category
   * Get notices by category
   */
  async getNoticesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = String(Array.isArray(req.params.category) ? req.params.category[0] : req.params.category);
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      
      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      // Validate pagination
      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await noticeService.getNoticesByCategory(
        category,
        page,
        pageSize
      );

      res.json({
        success: true,
        message: `Notices retrieved for category: ${category}`,
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to retrieve category notices";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/notices/:id
   * Get single notice by ID
   */
  async getNoticeById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id || typeof id !== "string" || !id.trim()) {
        throw new ValidationError("Notice ID is required");
      }

      const notice = await noticeService.getNoticeById(id);

      res.json({
        success: true,
        message: "Notice retrieved successfully",
        data: notice,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to retrieve notice";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/notices
   * Create new notice (admin only)
   */
  async createNotice(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError("User not authenticated");
      }

      const { title, message, category, priority, pinned } = req.body;

      // Validate required fields
      if (!title || !title.trim()) {
        throw new ValidationError("Title is required");
      }

      if (!message || !message.trim()) {
        throw new ValidationError("Message is required");
      }

      if (!category) {
        throw new ValidationError("Category is required");
      }

      const notice = await noticeService.createNotice(
        { title, message, category, priority, pinned },
        userId
      );

      res.status(201).json({
        success: true,
        message: "Notice created successfully",
        data: notice,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to create notice";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/v1/notices/:id
   * Update notice (admin only)
   */
  async updateNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id || typeof id !== "string" || !id.trim()) {
        throw new ValidationError("Notice ID is required");
      }

      const { title, message, category, priority, pinned } = req.body;

      // At least one field must be provided
      if (
        !title &&
        !message &&
        !category &&
        !priority &&
        pinned === undefined
      ) {
        throw new ValidationError(
          "At least one field must be provided to update"
        );
      }

      const notice = await noticeService.updateNotice(id, {
        title,
        message,
        category,
        priority,
        pinned,
      });

      res.json({
        success: true,
        message: "Notice updated successfully",
        data: notice,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to update notice";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/v1/notices/:id/pin
   * Pin or unpin notice (admin only)
   */
  async togglePinNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { pinned } = req.body;

      if (!id || typeof id !== "string" || !id.trim()) {
        throw new ValidationError("Notice ID is required");
      }

      if (pinned === undefined) {
        throw new ValidationError("Pinned status is required");
      }

      if (typeof pinned !== "boolean") {
        throw new ValidationError("Pinned must be a boolean value");
      }

      const notice = await noticeService.togglePinNotice(id, pinned);

      res.json({
        success: true,
        message: `Notice ${pinned ? "pinned" : "unpinned"} successfully`,
        data: notice,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to pin/unpin notice";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/v1/notices/:id
   * Delete notice (admin only)
   */
  async deleteNotice(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id || typeof id !== "string" || !id.trim()) {
        throw new ValidationError("Notice ID is required");
      }

      await noticeService.deleteNotice(id);

      res.json({
        success: true,
        message: "Notice deleted successfully",
        data: null,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to delete notice";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/notices/search/:query
   * Search notices by title or message
   */
  async searchNotices(req: Request, res: Response): Promise<void> {
    try {
      const queryParam = String(Array.isArray(req.params.query) ? req.params.query[0] : req.params.query || "");
      const qParam = String(Array.isArray(req.query.q) ? req.query.q[0] : req.query.q || "");
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      
      const query = queryParam || qParam;
      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (!query || !query.trim()) {
        throw new ValidationError("Search query is required");
      }

      // Validate pagination
      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await noticeService.searchNotices(query, page, pageSize);

      res.json({
        success: true,
        message: "Search results retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      const message = error.message || "Failed to search notices";

      res.status(status).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }
}

export const noticeController = new NoticeController();
