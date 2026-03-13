import { Request, Response } from "express";
import { examService } from "../services/exam.service.js";
import { ValidationError } from "../utils/errors.js";
import { buildCsv } from "../utils/csv.js";

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

export class ExamController {
  /**
   * GET /api/v1/exams
   * Get all exams with filters
   */
  async getExams(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
      const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
      const subjectIdParam = String(Array.isArray(req.query.subjectId) ? req.query.subjectId[0] : req.query.subjectId || "");
      const typeParam = String(Array.isArray(req.query.type) ? req.query.type[0] : req.query.type || "");
      const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await examService.getExams(
        page,
        pageSize,
        statusParam || undefined,
        classIdParam || undefined,
        subjectIdParam || undefined,
        typeParam || undefined,
        searchParam || undefined
      );

      res.json({
        success: true,
        message: "Exams retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve exams",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/exams/export
   * Export filtered exams as CSV
   */
  async exportExams(req: Request, res: Response): Promise<void> {
    try {
      const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
      const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
      const subjectIdParam = String(Array.isArray(req.query.subjectId) ? req.query.subjectId[0] : req.query.subjectId || "");
      const typeParam = String(Array.isArray(req.query.type) ? req.query.type[0] : req.query.type || "");
      const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");

      const firstPage = await examService.getExams(
        1,
        1,
        statusParam || undefined,
        classIdParam || undefined,
        subjectIdParam || undefined,
        typeParam || undefined,
        searchParam || undefined
      );

      const pageSize = Math.max(firstPage.pagination.total, 1);
      const result = await examService.getExams(
        1,
        pageSize,
        statusParam || undefined,
        classIdParam || undefined,
        subjectIdParam || undefined,
        typeParam || undefined,
        searchParam || undefined
      );

      const rows = result.exams.map((exam) => ({
        id: exam.id,
        name: exam.name,
        class: `${exam.class?.name || ""}-${exam.class?.section || ""}`,
        subject: exam.subject?.name || "",
        date: exam.date,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        type: exam.type,
        status: exam.status,
      }));

      const csv = buildCsv(rows, [
        "id",
        "name",
        "class",
        "subject",
        "date",
        "duration",
        "totalMarks",
        "type",
        "status",
      ]);

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename=exams-${new Date().toISOString().slice(0, 10)}.csv`);
      res.status(200).send(csv);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to export exams",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/exams/:id
   * Get single exam
   */
  async getExamById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Exam ID is required");
      }

      const exam = await examService.getExamById(id);

      res.json({
        success: true,
        message: "Exam retrieved successfully",
        data: exam,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve exam",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/exams
   * Create exam (Admin only)
   */
  async createExam(req: Request, res: Response): Promise<void> {
    try {
      const { name, classId, subjectId, date, duration, totalMarks, type, status } = req.body;

      if (!name || !name.trim()) {
        throw new ValidationError("Exam name is required");
      }
      if (!classId || !classId.trim()) {
        throw new ValidationError("Class ID is required");
      }
      if (!subjectId || !subjectId.trim()) {
        throw new ValidationError("Subject ID is required");
      }
      if (!date) {
        throw new ValidationError("Date is required");
      }
      if (!duration || !duration.trim()) {
        throw new ValidationError("Duration is required");
      }
      if (!totalMarks || totalMarks <= 0) {
        throw new ValidationError("Total marks must be greater than 0");
      }
      if (!type) {
        throw new ValidationError("Exam type is required");
      }

      const exam = await examService.createExam({
        name,
        classId,
        subjectId,
        date: new Date(date),
        duration,
        totalMarks,
        type,
        status,
      });

      res.status(201).json({
        success: true,
        message: "Exam created successfully",
        data: exam,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to create exam",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/v1/exams/:id
   * Update exam (Admin only)
   */
  async updateExam(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Exam ID is required");
      }

      const { name, date, duration, totalMarks, type, status } = req.body;

      if (!name && !date && !duration && !totalMarks && !type && !status) {
        throw new ValidationError("At least one field must be provided");
      }

      const exam = await examService.updateExam(id, {
        name,
        date: date ? new Date(date) : undefined,
        duration,
        totalMarks,
        type,
        status,
      });

      res.json({
        success: true,
        message: "Exam updated successfully",
        data: exam,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to update exam",
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/v1/exams/:id
   * Delete exam (Admin only)
   */
  async deleteExam(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Exam ID is required");
      }

      await examService.deleteExam(id);

      res.json({
        success: true,
        message: "Exam deleted successfully",
        data: null,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to delete exam",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/exams/stats
   * Get exam statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await examService.getStatistics();

      res.json({
        success: true,
        message: "Exam statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve statistics",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/exams/:id/results
   * Get exam with results
   */
  async getExamWithResults(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Exam ID is required");
      }

      const examWithResults = await examService.getExamWithResults(id);

      res.json({
        success: true,
        message: "Exam with results retrieved successfully",
        data: examWithResults,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve exam with results",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/exams/bulk
   * Bulk create exams (Admin only)
   */
  async bulkCreateExams(req: Request, res: Response): Promise<void> {
    try {
      const { exams } = req.body;

      if (!Array.isArray(exams) || exams.length === 0) {
        throw new ValidationError("Exams array is required and must not be empty");
      }

      const result = await examService.bulkCreateExams({ exams });

      res.status(201).json({
        success: true,
        message: "Bulk exams created successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to bulk create exams",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/exams/search/:query
   * Search exams
   */
  async searchExams(req: Request, res: Response): Promise<void> {
    try {
      const queryParam = String(Array.isArray(req.params.query) ? req.params.query[0] : req.params.query || "");
      const qParam = String(Array.isArray(req.query.q) ? req.query.q[0] : req.query.q || "");
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");

      const query = queryParam || qParam;
      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (!query || !query.trim()) {
        throw new ValidationError("Search query is required");
      }

      const result = await examService.searchExams(query, page, pageSize);

      res.json({
        success: true,
        message: "Search results retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to search exams",
        error: error.message,
      });
    }
  }
}

export const examController = new ExamController();
