import { Request, Response } from "express";
import { classService } from "../services/class.service";
import { ValidationError } from "../utils/errors";

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

export class ClassController {
  /**
   * GET /api/v1/classes
   * Get all classes with pagination
   */
  async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await classService.getClasses(page, pageSize, searchParam || undefined);

      res.json({
        success: true,
        message: "Classes retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve classes",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/classes/:id
   * Get single class
   */
  async getClassById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Class ID is required");
      }

      const classRecord = await classService.getClassById(id);

      res.json({
        success: true,
        message: "Class retrieved successfully",
        data: classRecord,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve class",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/classes
   * Create class (Admin only)
   */
  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const { name, section, classTeacherId, capacity } = req.body;

      if (!name || !name.trim()) {
        throw new ValidationError("Class name is required");
      }
      if (!section || !section.trim()) {
        throw new ValidationError("Section is required");
      }
      if (!classTeacherId || !classTeacherId.trim()) {
        throw new ValidationError("Class teacher ID is required");
      }

      const classRecord = await classService.createClass({
        name,
        section,
        classTeacherId,
        capacity,
      });

      res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: classRecord,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to create class",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/v1/classes/:id
   * Update class (Admin only)
   */
  async updateClass(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Class ID is required");
      }

      const { name, section, classTeacherId, capacity } = req.body;

      if (!name && !section && !classTeacherId && !capacity) {
        throw new ValidationError("At least one field must be provided");
      }

      const classRecord = await classService.updateClass(id, {
        name,
        section,
        classTeacherId,
        capacity,
      });

      res.json({
        success: true,
        message: "Class updated successfully",
        data: classRecord,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to update class",
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/v1/classes/:id
   * Delete class (Admin only)
   */
  async deleteClass(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Class ID is required");
      }

      await classService.deleteClass(id);

      res.json({
        success: true,
        message: "Class deleted successfully",
        data: null,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to delete class",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/classes/stats
   * Get class statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await classService.getStatistics();

      res.json({
        success: true,
        message: "Class statistics retrieved successfully",
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
   * POST /api/v1/classes/:id/subjects
   * Assign subjects to class
   */
  async assignSubjects(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Class ID is required");
      }

      const { subjectIds } = req.body;

      if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        throw new ValidationError("Subject IDs array is required and must not be empty");
      }

      const classRecord = await classService.assignSubjects(id, { subjectIds });

      res.json({
        success: true,
        message: "Subjects assigned successfully",
        data: classRecord,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to assign subjects",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/classes/bulk
   * Bulk create classes (Admin only)
   */
  async bulkCreateClasses(req: Request, res: Response): Promise<void> {
    try {
      const { classes } = req.body;

      if (!Array.isArray(classes) || classes.length === 0) {
        throw new ValidationError("Classes array is required and must not be empty");
      }

      const result = await classService.bulkCreateClasses({ classes });

      res.status(201).json({
        success: true,
        message: "Bulk classes created successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to bulk create classes",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/classes/search/:query
   * Search classes
   */
  async searchClasses(req: Request, res: Response): Promise<void> {
    try {
      const queryParam = String(Array.isArray(req.params.query) ? req.params.query[0] : req.params.query || "");
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");

      const query = queryParam;
      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (!query || !query.trim()) {
        throw new ValidationError("Search query is required");
      }

      const result = await classService.searchClasses(query, page, pageSize);

      res.json({
        success: true,
        message: "Search results retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to search classes",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/classes/:id/students/count
   * Get student count for a class
   */
  async getStudentCount(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Class ID is required");
      }

      const count = await classService.getClassStudentCount(id);

      res.json({
        success: true,
        message: "Student count retrieved successfully",
        data: { count },
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve student count",
        error: error.message,
      });
    }
  }
}

export const classController = new ClassController();
