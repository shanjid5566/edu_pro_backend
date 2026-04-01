import { Request, Response } from "express";
import studentExamService from "../services/studentExamService.js";

class StudentExamController {
  // Get all exams
  async getMyExams(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentExamService.getMyExams(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getMyExams:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get upcoming exams
  async getUpcomingExams(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentExamService.getUpcomingExams(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getUpcomingExams:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get exam details
  async getExamDetails(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;
      const { examId } = req.params;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!examId) {
        return res.status(400).json({
          success: false,
          message: "Exam ID is required",
        });
      }

      const result = await studentExamService.getExamDetails(studentId, examId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getExamDetails:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get exams by status
  async getExamsByStatus(req: Request, res: Response) {
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

      const result = await studentExamService.getExamsByStatus(
        studentId,
        status
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getExamsByStatus:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get exam results
  async getExamResults(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentExamService.getExamResults(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getExamResults:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get exam statistics
  async getStatistics(req: Request, res: Response) {
    try {
      const studentId = (req as any).userId;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await studentExamService.getExamStatistics(studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getStatistics:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new StudentExamController();
