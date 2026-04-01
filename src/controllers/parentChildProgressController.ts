import { Request, Response } from "express";
import parentChildProgressService from "../services/parentChildProgressService.js";

class ParentChildProgressController {
  // Get progress metrics
  async getProgressMetrics(req: Request, res: Response) {
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

      const result = await parentChildProgressService.getProgressMetrics(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getProgressMetrics:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get progress over time
  async getProgressOverTime(req: Request, res: Response) {
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

      const result = await parentChildProgressService.getProgressOverTime(
        parentId,
        studentId,
        monthsParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getProgressOverTime:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get subject-wise performance
  async getSubjectWisePerformance(req: Request, res: Response) {
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

      const result = await parentChildProgressService.getSubjectWisePerformance(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getSubjectWisePerformance:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get exam results with trends
  async getExamResultsWithTrends(req: Request, res: Response) {
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

      const result = await parentChildProgressService.getExamResultsWithTrends(
        parentId,
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getExamResultsWithTrends:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get performance summary
  async getPerformanceSummary(req: Request, res: Response) {
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

      const result = await parentChildProgressService.getPerformanceSummary(
        parentId,
        studentId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPerformanceSummary:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ParentChildProgressController();
