import { Request, Response } from "express";
import teacherExamService from "../services/teacherExamService.js";

class TeacherExamController {
  // Get all exams for teacher
  async getMyExams(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherExamService.getMyExams(teacherId);
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

  // Get exams for a specific class
  async getClassExams(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;
      const { classId } = req.params;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!classId) {
        return res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
      }

      const result = await teacherExamService.getClassExams(
        teacherId,
        classId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getClassExams:", error);
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
      const teacherId = (req as any).userId;
      const { examId } = req.params;

      if (!teacherId) {
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

      const result = await teacherExamService.getExamDetails(
        teacherId,
        examId
      );
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
      const teacherId = (req as any).userId;
      const { status } = req.params;

      if (!teacherId) {
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

      if (!["UPCOMING", "ONGOING", "COMPLETED"].includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be UPCOMING, ONGOING, or COMPLETED",
        });
      }

      const result = await teacherExamService.getExamsByStatus(
        teacherId,
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

  // Submit exam marks
  async submitMarks(req: Request, res: Response) {
    try {
      const teacherId = (req as any).userId;
      const { examId } = req.params;
      const { marks } = req.body;

      if (!teacherId) {
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

      if (!marks || !Array.isArray(marks)) {
        return res.status(400).json({
          success: false,
          message: "Marks array is required",
        });
      }

      // Validate marks format
      for (const mark of marks) {
        if (!mark.studentId) {
          return res.status(400).json({
            success: false,
            message: "Each mark entry must have studentId",
          });
        }
      }

      const result = await teacherExamService.submitExamMarks(
        teacherId,
        examId,
        marks
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error in submitMarks:", error);
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
      const teacherId = (req as any).userId;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await teacherExamService.getExamsByStatus(teacherId, status);
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

export default new TeacherExamController();
