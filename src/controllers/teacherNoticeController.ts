import { Request, Response } from "express";
import teacherNoticeService from "../services/teacherNoticeService.js";

class TeacherNoticeController {
  // Get all notices
  async getAllNotices(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, search } = req.query;

      const result = await teacherNoticeService.getAllNotices(
        Number(page),
        Number(limit),
        category as string,
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllNotices:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get notices by category
  async getNoticesByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }

      const validCategories = ["general", "exam", "event", "holiday"];
      if (!validCategories.includes(category.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category. Must be general, exam, event, or holiday",
        });
      }

      const result = await teacherNoticeService.getNoticesByCategory(category);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getNoticesByCategory:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get pinned notices
  async getPinnedNotices(req: Request, res: Response) {
    try {
      const result = await teacherNoticeService.getPinnedNotices();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPinnedNotices:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get recent notices
  async getRecentNotices(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      const result = await teacherNoticeService.getRecentNotices(
        Number(limit)
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRecentNotices:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get notice by ID
  async getNoticeById(req: Request, res: Response) {
    try {
      const { noticeId } = req.params;

      if (!noticeId) {
        return res.status(400).json({
          success: false,
          message: "Notice ID is required",
        });
      }

      const result = await teacherNoticeService.getNoticeById(noticeId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getNoticeById:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Search notices
  async searchNotices(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await teacherNoticeService.searchNotices(query as string);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in searchNotices:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get notice statistics
  async getStatistics(req: Request, res: Response) {
    try {
      const result = await teacherNoticeService.getNoticeStatistics();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getStatistics:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new TeacherNoticeController();
