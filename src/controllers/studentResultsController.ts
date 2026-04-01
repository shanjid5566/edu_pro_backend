import { Request, Response } from "express";
import studentResultsService from "../services/studentResultsService.js";

class StudentResultsController {
  // Get all results
  async getAllResults(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentResultsService.getAllResults(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllResults:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get results by subject
  async getResultsBySubject(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { subjectId } = req.params;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: "Subject ID is required",
        });
      }

      const result = await studentResultsService.getResultsBySubject(
        studentId,
        subjectId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getResultsBySubject:", error);
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

      const result = await studentResultsService.getSubjectPerformance(
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

  // Get class comparison
  async getClassComparison(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentResultsService.getClassComparison(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getClassComparison:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get performance trend
  async getPerformanceTrend(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { months } = req.query;
      const monthsParam = months ? parseInt(months as string) : 6;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentResultsService.getPerformanceTrend(
        studentId,
        monthsParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPerformanceTrend:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get results summary
  async getResultsSummary(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentResultsService.getResultsSummary(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getResultsSummary:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new StudentResultsController();
