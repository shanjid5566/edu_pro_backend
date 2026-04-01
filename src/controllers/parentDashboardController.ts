import { Request, Response } from "express";
import parentDashboardService from "../services/parentDashboardService.js";

class ParentDashboardController {
  // Get my children
  async getMyChildren(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await parentDashboardService.getMyChildren(parentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getMyChildren:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get child overview
  async getChildOverview(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;

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

      const result = await parentDashboardService.getChildOverview(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getChildOverview:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get attendance trend
  async getAttendanceTrend(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;
      const { months } = req.query;
      const monthsParam = months ? parseInt(months as string) : 6;

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

      const result = await parentDashboardService.getAttendanceTrend(
        parentId,
        studentId,
        monthsParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAttendanceTrend:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get recent results
  async getRecentResults(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;
      const { limit } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 5;

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

      const result = await parentDashboardService.getRecentResults(
        parentId,
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRecentResults:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get subject performance
  async getSubjectPerformance(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;

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

      const result = await parentDashboardService.getSubjectPerformance(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getSubjectPerformance:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get upcoming events
  async getUpcomingEvents(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;
      const { limit } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 5;

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

      const result = await parentDashboardService.getUpcomingEvents(
        parentId,
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getUpcomingEvents:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get notifications
  async getNotifications(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;
      const { limit } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 5;

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

      const result = await parentDashboardService.getNotifications(
        parentId,
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getNotifications:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ParentDashboardController();
