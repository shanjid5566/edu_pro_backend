import { Request, Response } from "express";
import dashboardService from "../services/dashboardService";

class DashboardController {
  /**
   * Get complete dashboard overview
   */
  async getDashboard(req: Request, res: Response) {
    try {
      const data = await dashboardService.getDashboardData();

      return res.status(200).json({
        success: true,
        message: "Dashboard data retrieved successfully",
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve dashboard data",
      });
    }
  }

  /**
   * Get dashboard overview (counts only)
   */
  async getOverview(req: Request, res: Response) {
    try {
      const overview = await dashboardService.getOverview();

      return res.status(200).json({
        success: true,
        message: "Overview data retrieved successfully",
        data: overview,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve overview",
      });
    }
  }

  /**
   * Get attendance trend data for chart
   */
  async getAttendanceTrend(req: Request, res: Response) {
    try {
      const trend = await dashboardService.getAttendanceTrend();

      return res.status(200).json({
        success: true,
        message: "Attendance trend data retrieved successfully",
        data: trend,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve attendance trend",
      });
    }
  }

  /**
   * Get performance by subject data for chart
   */
  async getPerformanceBySubject(req: Request, res: Response) {
    try {
      const performance = await dashboardService.getPerformanceBySubject();

      return res.status(200).json({
        success: true,
        message: "Performance data retrieved successfully",
        data: performance,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve performance data",
      });
    }
  }

  /**
   * Get today's attendance summary
   */
  async getTodayAttendance(req: Request, res: Response) {
    try {
      const attendance = await dashboardService.getTodayAttendance();

      return res.status(200).json({
        success: true,
        message: "Today's attendance data retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve today's attendance",
      });
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 5;
      const activities = await dashboardService.getRecentActivity(limit);

      return res.status(200).json({
        success: true,
        message: "Recent activities retrieved successfully",
        data: activities,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve recent activities",
      });
    }
  }
}

export default new DashboardController();
