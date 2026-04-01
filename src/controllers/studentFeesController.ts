import { Request, Response } from "express";
import studentFeesService from "../services/studentFeesService.js";

class StudentFeesController {
  // Get all fees
  async getAllFees(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentFeesService.getAllFees(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllFees:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fees by status
  async getFeesByStatus(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { status } = req.params;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await studentFeesService.getFeesByStatus(studentId, status);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeesByStatus:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fee summary
  async getFeeSummary(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentFeesService.getFeeSummary(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeeSummary:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fees by type
  async getFeesByType(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentFeesService.getFeesByType(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeesByType:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fee timeline
  async getFeeTimeline(req: Request, res: Response) {
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

      const result = await studentFeesService.getFeeTimeline(
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeeTimeline:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get upcoming fees
  async getUpcomingFees(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentFeesService.getPendingFees(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getUpcomingFees:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get overdue fees
  async getOverdueFees(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentFeesService.getPaidFees(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getOverdueFees:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new StudentFeesController();
