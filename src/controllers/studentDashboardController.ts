import { Request, Response } from "express";
import studentDashboardService from "../services/studentDashboardService.js";

class StudentDashboardController {
  // Get dashboard overview
  async getDashboardOverview(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentDashboardService.getDashboardOverview(
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getDashboardOverview:", error);
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
      const studentId = (req as any).userId;
      const months = parseInt(req.query.months as string) || 6;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentDashboardService.getAttendanceTrend(
        studentId,
        months
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

  // Get subject performance
  async getSubjectPerformance(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentDashboardService.getSubjectPerformance(
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

  // Get my classes
  async getMyClasses(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentDashboardService.getMyClasses(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getMyClasses:", error);
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
      const studentId = (req as any).userId;
      const limit = parseInt(req.query.limit as string) || 5;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentDashboardService.getRecentResults(
        studentId,
        limit
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
}

export default new StudentDashboardController();
