import { Request, Response } from "express";
import parentChildNoticesService from "../services/parentChildNoticesService.js";

class ParentChildNoticesController {
  // Get all notices
  async getAllNotices(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const { limit, offset } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 20;
      const offsetParam = offset ? parseInt(offset as string) : 0;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildNoticesService.getAllNotices(
        parentId,
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
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildNoticesService.getPinnedNotices(
        parentId,
        studentId
      );
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

  // Get notices by category
  async getNoticesByCategory(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const category = req.params.category as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }

      const result = await parentChildNoticesService.getNoticesByCategory(
        parentId,
        studentId,
        category
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

  // Get recent notices
  async getRecentNotices(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const { days } = req.query;
      const daysParam = days ? parseInt(days as string) : 7;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildNoticesService.getRecentNotices(
        parentId,
        studentId,
        daysParam
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

  // Get notice details
  async getNoticeDetails(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const noticeId = req.params.noticeId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      if (!noticeId) {
        return res.status(400).json({
          success: false,
          message: "Notice ID is required",
        });
      }

      const result = await parentChildNoticesService.getNoticeDetails(
        parentId,
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

  // Get notice statistics
  async getNoticeStatistics(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildNoticesService.getNoticeStatistics(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getNoticeStatistics:", error);
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
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const { query } = req.query;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await parentChildNoticesService.searchNotices(
        parentId,
        studentId,
        query as string
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
}

export default new ParentChildNoticesController();
