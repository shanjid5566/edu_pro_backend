/**
 * Teacher Controller
 * Handles HTTP requests for teacher management
 */

import { Request, Response } from "express";
import { teacherService } from "../services/teacher.service";
import { ValidationError, BadRequestError } from "../utils/errors";

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

export class TeacherController {
  /**
   * GET /api/v1/teachers
   * Get all teachers with pagination and optional filtering
   * Query params: page, pageSize, search, department
   */
  async getTeachers(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");
      const departmentParam = String(
        Array.isArray(req.query.department) ? req.query.department[0] : req.query.department || ""
      );

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await teacherService.getTeachers(
        page,
        pageSize,
        searchParam || undefined,
        departmentParam || undefined
      );

      res.json({
        success: true,
        message: "Teachers retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve teachers",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/teachers/:id
   * Get single teacher by ID with statistics
   */
  async getTeacherById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Teacher ID is required");
      }

      const teacher = await teacherService.getTeacherById(id);

      res.json({
        success: true,
        message: "Teacher retrieved successfully",
        data: teacher,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve teacher",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/teachers
   * Create new teacher (Admin only)
   * Body: { name, email, password, phone, department, subjects[], classes[], joinDate, avatar }
   */
  async createTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phone, department, subjects, classes, joinDate, avatar } = req.body;

      if (!name || !name.trim()) {
        throw new ValidationError("Name is required");
      }

      if (!email || !email.trim()) {
        throw new ValidationError("Email is required");
      }

      if (!password || password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters long");
      }

      if (!department || !department.trim()) {
        throw new ValidationError("Department is required");
      }

      const teacher = await teacherService.createTeacher({
        name,
        email,
        password,
        phone,
        department,
        subjects,
        classes,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        avatar,
      });

      res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        data: teacher,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to create teacher",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/v1/teachers/:id
   * Update teacher information (Admin only)
   * Body: { name, email, phone, department, subjects[], classes[], status, avatar }
   */
  async updateTeacher(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      const { name, email, phone, department, subjects, classes, status, avatar } = req.body;

      if (!id || !id.trim()) {
        throw new ValidationError("Teacher ID is required");
      }

      // Note: Email update is not allowed to prevent conflicts
      // Password should be updated via a separate endpoint

      const teacher = await teacherService.updateTeacher(id, {
        name,
        phone,
        department,
        subjects,
        classes,
        status,
        avatar,
      });

      res.json({
        success: true,
        message: "Teacher updated successfully",
        data: teacher,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to update teacher",
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/v1/teachers/:id
   * Delete teacher (Admin only)
   */
  async deleteTeacher(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Teacher ID is required");
      }

      await teacherService.deleteTeacher(id);

      res.json({
        success: true,
        message: "Teacher deleted successfully",
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to delete teacher",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/teachers/:id/assign-subjects
   * Assign subjects to teacher
   * Body: { subjectIds: string[] }
   */
  async assignSubjects(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      const { subjectIds } = req.body;

      if (!id || !id.trim()) {
        throw new ValidationError("Teacher ID is required");
      }

      if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        throw new ValidationError("Subject IDs array is required");
      }

      await teacherService.assignSubjects({
        teacherId: id,
        subjectIds,
      });

      res.json({
        success: true,
        message: "Subjects assigned successfully",
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
   * POST /api/v1/teachers/:id/assign-classes
   * Assign classes to teacher
   * Body: { classIds: string[] }
   */
  async assignClasses(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      const { classIds } = req.body;

      if (!id || !id.trim()) {
        throw new ValidationError("Teacher ID is required");
      }

      if (!Array.isArray(classIds) || classIds.length === 0) {
        throw new ValidationError("Class IDs array is required");
      }

      await teacherService.assignClasses({
        teacherId: id,
        classIds,
      });

      res.json({
        success: true,
        message: "Classes assigned successfully",
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to assign classes",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/teachers/:id/stats
   * Get teacher statistics
   */
  async getTeacherStats(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Teacher ID is required");
      }

      const stats = await teacherService.getTeacherStats(id);

      res.json({
        success: true,
        message: "Teacher statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve teacher statistics",
        error: error.message,
      });
    }
  }
}

export const teacherController = new TeacherController();
