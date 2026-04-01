import { Request, Response } from "express";
import parentChildAttendanceService from "../services/parentChildAttendanceService.js";

class ParentChildAttendanceController {
  // Get attendance summary
  async getAttendanceSummary(req: Request, res: Response) {
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

      const result = await parentChildAttendanceService.getAttendanceSummary(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAttendanceSummary:", error);
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

      const result = await parentChildAttendanceService.getAttendanceTrend(
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

  // Get recent attendance
  async getRecentAttendance(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;
      const { limit } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 10;

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

      const result = await parentChildAttendanceService.getRecentAttendance(
        parentId,
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRecentAttendance:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get attendance by date range
  async getAttendanceByDateRange(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;

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

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "startDate and endDate are required",
        });
      }

      const result = await parentChildAttendanceService.getAttendanceByDateRange(
        parentId,
        studentId,
        startDate as string,
        endDate as string
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAttendanceByDateRange:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get attendance statistics
  async getAttendanceStatistics(req: Request, res: Response) {
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

      const result = await parentChildAttendanceService.getAttendanceStatistics(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAttendanceStatistics:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ParentChildAttendanceController();
