import { Request, Response } from "express";
import { adminNoticeService } from "../services/adminNoticeService.js";

export class AdminNoticeController {
  // Get all notices (public)
  async getAllNotices(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, search } = req.query;

      const result = await adminNoticeService.getAllNotices(
        Number(page),
        Number(limit),
        category as string,
        search as string
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Get notices by category (public)
  async getNoticesByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;

      if (!category) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Category is required",
          });
      }

      const notices = await adminNoticeService.getNoticesByCategory(category);

      return res.status(200).json({
        success: true,
        data: notices,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Get pinned notices (public)
  async getPinnedNotices(req: Request, res: Response) {
    try {
      const notices = await adminNoticeService.getPinnedNotices();

      return res.status(200).json({
        success: true,
        data: notices,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Get recent notices (public)
  async getRecentNotices(req: Request, res: Response) {
    try {
      const { limit = 5 } = req.query;
      const notices = await adminNoticeService.getRecentNotices(Number(limit));

      return res.status(200).json({
        success: true,
        data: notices,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Get single notice (public)
  async getNoticeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Notice ID is required",
          });
      }

      const notice = await adminNoticeService.getNoticeById(id);

      return res.status(200).json({
        success: true,
        data: notice,
      });
    } catch (error: any) {
      return res.status(error.message === "Notice not found" ? 404 : 500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }

  // Create notice (Admin only)
  async createNotice(req: Request, res: Response) {
    try {
      const { title, message, category, priority, pinned } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const notice = await adminNoticeService.createNotice({
        title,
        message,
        category,
        priority,
        pinned,
        createdBy: userId,
      });

      return res.status(201).json({
        success: true,
        message: "Notice created successfully",
        data: notice,
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Update notice (Admin only)
  async updateNotice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, message, category, priority, pinned } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Notice ID is required",
          });
      }

      const notice = await adminNoticeService.updateNotice(id, {
        title,
        message,
        category,
        priority,
        pinned,
      });

      return res.status(200).json({
        success: true,
        message: "Notice updated successfully",
        data: notice,
      });
    } catch (error: any) {
      return res
        .status(error.message === "Notice not found" ? 404 : 400)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Delete notice (Admin only)
  async deleteNotice(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Notice ID is required",
          });
      }

      await adminNoticeService.deleteNotice(id);

      return res.status(200).json({
        success: true,
        message: "Notice deleted successfully",
      });
    } catch (error: any) {
      return res
        .status(error.message === "Notice not found" ? 404 : 500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Search notices (public)
  async searchNotices(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Search query is required",
          });
      }

      const notices = await adminNoticeService.searchNotices(query as string);

      return res.status(200).json({
        success: true,
        data: notices,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Get notice statistics (public)
  async getNoticeStatistics(req: Request, res: Response) {
    try {
      const stats = await adminNoticeService.getNoticeStatistics();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }

  // Toggle pin notice (Admin only)
  async togglePinNotice(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Notice ID is required",
          });
      }

      const notice = await adminNoticeService.togglePinNotice(id);

      return res.status(200).json({
        success: true,
        message: `Notice ${notice.pinned ? "pinned" : "unpinned"} successfully`,
        data: notice,
      });
    } catch (error: any) {
      return res
        .status(error.message === "Notice not found" ? 404 : 500)
        .json({ success: false, message: error.message || "Server error" });
    }
  }
}

export const adminNoticeController = new AdminNoticeController();
