import { Request, Response } from "express";
import adminDashboardService from "../services/adminDashboardService";

class AdminDashboardController {
  /**
   * Get admin dashboard data
   */
  async getDashboard(req: Request, res: Response) {
    try {
      const result = await adminDashboardService.getDashboardData();

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Dashboard error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch dashboard data",
      });
    }
  }

  /**
   * Get overall statistics
   */
  async getStats(req: Request, res: Response) {
    try {
      const stats = await adminDashboardService.getOverallStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get attendance trend
   */
  async getAttendanceTrend(req: Request, res: Response) {
    try {
      const data = await adminDashboardService.getAttendanceTrend();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get performance by subject
   */
  async getPerformance(req: Request, res: Response) {
    try {
      const data = await adminDashboardService.getPerformanceBySubject();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get today's attendance
   */
  async getTodayAttendance(req: Request, res: Response) {
    try {
      const data = await adminDashboardService.getTodayAttendance();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const data = await adminDashboardService.getRecentActivity(limit);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AdminDashboardController();
