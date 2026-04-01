import { Request, Response } from "express";
import studentNoticeService from "../services/studentNoticeService.js";

class StudentNoticeController {
  // Get all notices
  async getAllNotices(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { limit, offset } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 50;
      const offsetParam = offset ? parseInt(offset as string) : 0;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentNoticeService.getAllNotices(
        studentId,
        limitParam,
        offsetParam
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

  // Get pinned notices
  async getPinnedNotices(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentNoticeService.getPinnedNotices(studentId);
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
      const studentId = (req as any).userId;
      const { limit } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 10;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentNoticeService.getRecentNotices(
        studentId,
        limitParam
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

  // Get notices by category
  async getNoticesByCategory(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { category } = req.params;
      const { limit, offset } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 50;
      const offsetParam = offset ? parseInt(offset as string) : 0;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }

      const result = await studentNoticeService.getNoticesByCategory(
        studentId,
        category,
        limitParam,
        offsetParam
      );
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

  // Search notices
  async searchNotices(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { keyword, limit, offset } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 50;
      const offsetParam = offset ? parseInt(offset as string) : 0;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: "Keyword is required for search",
        });
      }

      const result = await studentNoticeService.searchNotices(
        studentId,
        keyword as string,
        limitParam,
        offsetParam
      );
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

  // Get notice details
  async getNoticeDetails(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { noticeId } = req.params;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!noticeId) {
        return res.status(400).json({
          success: false,
          message: "Notice ID is required",
        });
      }

      const result = await studentNoticeService.getNoticeDetails(
        studentId,
        noticeId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getNoticeDetails:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get notices statistics
  async getStatistics(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentNoticeService.getNoticesStatistics(studentId);
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

export default new StudentNoticeController();
