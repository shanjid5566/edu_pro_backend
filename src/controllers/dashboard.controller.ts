/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard data
 */

import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { ValidationError } from "../utils/errors.js";

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

export class DashboardController {
  /**
   * GET /api/v1/dashboard
   * Get complete admin dashboard data (overview, charts, activities)
   */
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const dashboard = await dashboardService.getAdminDashboard();

      res.json({
        success: true,
        message: "Dashboard data retrieved successfully",
        data: dashboard,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve dashboard data",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/overview
   * Get dashboard overview statistics
   */
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const overview = await dashboardService.getDashboardOverview();

      res.json({
        success: true,
        message: "Dashboard overview retrieved successfully",
        data: overview,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve overview",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/attendance-trend
   * Get attendance trend data
   */
  async getAttendanceTrend(req: Request, res: Response): Promise<void> {
    try {
      const trend = await dashboardService.getAttendanceTrend();

      res.json({
        success: true,
        message: "Attendance trend retrieved successfully",
        data: trend,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve attendance trend",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/performance
   * Get performance by subject
   */
  async getPerformanceBySubject(req: Request, res: Response): Promise<void> {
    try {
      const performance = await dashboardService.getPerformanceBySubject();

      res.json({
        success: true,
        message: "Performance data retrieved successfully",
        data: performance,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve performance data",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/todays-attendance
   * Get today's attendance overview
   */
  async getTodaysAttendance(req: Request, res: Response): Promise<void> {
    try {
      const attendance = await dashboardService.getTodaysAttendance();

      res.json({
        success: true,
        message: "Today's attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve today's attendance",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/recent-activity
   * Get recent activity
   * Query params: limit
   */
  async getRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      const limitParam = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit || "");
      const limit = parseInt(limitParam || "10") || 10;

      if (limit < 1 || limit > 100) {
        throw new ValidationError("Limit must be between 1 and 100");
      }

      const activity = await dashboardService.getRecentActivity(limit);

      res.json({
        success: true,
        message: "Recent activity retrieved successfully",
        data: activity,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve recent activity",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/class-statistics
   * Get statistics for all classes
   * Query params: page, pageSize
   */
  async getClassStatistics(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const stats = await dashboardService.getClassStatistics(page, pageSize);

      res.json({
        success: true,
        message: "Class statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve class statistics",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/teacher-performance
   * Get teacher performance metrics
   * Query params: page, pageSize
   */
  async getTeacherPerformance(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const performance = await dashboardService.getTeacherPerformance(page, pageSize);

      res.json({
        success: true,
        message: "Teacher performance retrieved successfully",
        data: performance,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve teacher performance",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/student-performance
   * Get student performance metrics
   * Query params: page, pageSize, classId
   */
  async getStudentPerformance(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const performance = await dashboardService.getStudentPerformance(
        page,
        pageSize,
        classIdParam || undefined
      );

      res.json({
        success: true,
        message: "Student performance retrieved successfully",
        data: performance,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve student performance",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/fee-collection
   * Get fee collection summary
   */
  async getFeeCollectionSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await dashboardService.getFeeCollectionSummary();

      res.json({
        success: true,
        message: "Fee collection summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve fee collection summary",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/dashboard/exam-summary
   * Get exam summary
   */
  async getExamSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await dashboardService.getExamSummary();

      res.json({
        success: true,
        message: "Exam summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve exam summary",
        error: error.message,
      });
    }
  }
}

export const dashboardController = new DashboardController();
