import { Request, Response } from "express";
import adminExamService from "../services/adminExamService";

class AdminExamController {
  /**
   * Get all exams with pagination, search, and filters
   */
  async getAllExams(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const classId = (req.query.classId as string) || undefined;
      const status = (req.query.status as string) || undefined;

      const skip = (page - 1) * limit;

      const result = await adminExamService.getAllExams({
        skip,
        take: limit,
        search: search || undefined,
        classId,
        status,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch exams",
      });
    }
  }

  /**
   * Get exam by ID
   */
  async getExamById(req: Request, res: Response) {
    try {
      const examId = req.params.examId as string;

      if (!examId) {
        res.status(400).json({
          success: false,
          message: "Exam ID is required",
        });
        return;
      }

      const result = await adminExamService.getExamById(examId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch exam",
      });
    }
  }

  /**
   * Create exam
   */
  async createExam(req: Request, res: Response) {
    try {
      const { name, classId, subjectId, date, duration, totalMarks, type } =
        req.body;

      // Validation
      if (!name || !classId || !subjectId || !date || !duration || !totalMarks || !type) {
        res.status(400).json({
          success: false,
          message:
            "Exam name, class, subject, date, duration, total marks, and type are required",
        });
        return;
      }

      if (totalMarks < 1) {
        res.status(400).json({
          success: false,
          message: "Total marks must be at least 1",
        });
        return;
      }

      if (!["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"].includes(type)) {
        res.status(400).json({
          success: false,
          message: "Invalid exam type. Must be MONTHLY, QUARTERLY, HALF_YEARLY, or YEARLY",
        });
        return;
      }

      const result = await adminExamService.createExam({
        name,
        classId,
        subjectId,
        date,
        duration,
        totalMarks,
        type,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create exam",
      });
    }
  }

  /**
   * Update exam
   */
  async updateExam(req: Request, res: Response) {
    try {
      const examId = req.params.examId as string;
      const { name, classId, subjectId, date, duration, totalMarks, type, status } = req.body;

      if (!examId) {
        res.status(400).json({
          success: false,
          message: "Exam ID is required",
        });
        return;
      }

      if (totalMarks && totalMarks < 1) {
        res.status(400).json({
          success: false,
          message: "Total marks must be at least 1",
        });
        return;
      }

      if (
        type &&
        !["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"].includes(type)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid exam type. Must be MONTHLY, QUARTERLY, HALF_YEARLY, or YEARLY",
        });
        return;
      }

      if (
        status &&
        !["UPCOMING", "ONGOING", "COMPLETED"].includes(status)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid status. Must be UPCOMING, ONGOING, or COMPLETED",
        });
        return;
      }

      const result = await adminExamService.updateExam(examId, {
        name,
        classId,
        subjectId,
        date,
        duration,
        totalMarks,
        type,
        status,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update exam",
      });
    }
  }

  /**
   * Delete exam
   */
  async deleteExam(req: Request, res: Response) {
    try {
      const examId = req.params.examId as string;

      if (!examId) {
        res.status(400).json({
          success: false,
          message: "Exam ID is required",
        });
        return;
      }

      const result = await adminExamService.deleteExam(examId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete exam",
      });
    }
  }

  /**
   * Search exams
   */
  async searchExams(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || "";
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const result = await adminExamService.searchExams(query, limit);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to search exams",
      });
    }
  }

  /**
   * Get exams by class
   */
  async getExamsByClass(req: Request, res: Response) {
    try {
      const classId = req.params.classId as string;

      if (!classId) {
        res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
        return;
      }

      const result = await adminExamService.getExamsByClass(classId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch exams for class",
      });
    }
  }

  /**
   * Get exams by status
   */
  async getExamsByStatus(req: Request, res: Response) {
    try {
      const status = req.params.status as string;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!status) {
        res.status(400).json({
          success: false,
          message: "Status is required",
        });
        return;
      }

      const result = await adminExamService.getExamsByStatus(status, limit);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch exams by status",
      });
    }
  }

  /**
   * Get exam statistics
   */
  async getExamStatistics(req: Request, res: Response) {
    try {
      const result = await adminExamService.getExamStatistics();

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch exam statistics",
      });
    }
  }
}

export default new AdminExamController();
