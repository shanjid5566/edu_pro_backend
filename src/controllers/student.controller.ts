/**
 * Student Controller
 * Handles HTTP requests for student management
 */

import { Request, Response } from "express";
import { studentService } from "../services/student.service";
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

export class StudentController {
  /**
   * GET /api/v1/students
   * Get all students with pagination and optional filtering
   * Query params: page, pageSize, search, classId, section
   */
  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
      const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");
      const classIdParam = String(Array.isArray(req.query.classId) ? req.query.classId[0] : req.query.classId || "");
      const sectionParam = String(Array.isArray(req.query.section) ? req.query.section[0] : req.query.section || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }
      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("PageSize must be between 1 and 100");
      }

      const result = await studentService.getStudents(
        page,
        pageSize,
        searchParam || undefined,
        classIdParam || undefined,
        sectionParam || undefined
      );

      res.json({
        success: true,
        message: "Students retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve students",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/students/class/:classId
   * Get students by class
   */
  async getStudentsByClass(req: Request, res: Response): Promise<void> {
    try {
      const classId = String(Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId);
      const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
      const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");

      const page = parseInt(pageParam || "1") || 1;
      const pageSize = parseInt(pageSizeParam || "10") || 10;

      if (!classId || !classId.trim()) {
        throw new ValidationError("Class ID is required");
      }

      const result = await studentService.getStudentsByClass(classId, page, pageSize);

      res.json({
        success: true,
        message: "Class students retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve class students",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/students/:id
   * Get single student by ID with statistics
   */
  async getStudentById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Student ID is required");
      }

      const student = await studentService.getStudentById(id);

      res.json({
        success: true,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve student",
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/students
   * Create new student (Admin only)
   * Body: { name, email, password, phone, classId, section, rollNumber, dateOfBirth, gender, address, parentName, parentEmail }
   */
  async createStudent(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone,
        classId,
        section,
        rollNumber,
        dateOfBirth,
        gender,
        address,
        parentName,
        parentEmail,
      } = req.body;

      if (!name || !name.trim()) {
        throw new ValidationError("Name is required");
      }

      if (!email || !email.trim()) {
        throw new ValidationError("Email is required");
      }

      if (!password || password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters long");
      }

      if (!classId || !classId.trim()) {
        throw new ValidationError("Class ID is required");
      }

      if (!section || !section.trim()) {
        throw new ValidationError("Section is required");
      }

      if (!rollNumber || !rollNumber.trim()) {
        throw new ValidationError("Roll number is required");
      }

      const student = await studentService.createStudent({
        name,
        email,
        password,
        phone,
        classId,
        section,
        rollNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        parentName,
        parentEmail,
      });

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to create student",
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/v1/students/:id
   * Update student information (Admin only)
   * Body: { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status }
   */
  async updateStudent(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      const { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status } = req.body;

      if (!id || !id.trim()) {
        throw new ValidationError("Student ID is required");
      }

      const student = await studentService.updateStudent(id, {
        name,
        phone,
        classId,
        section,
        rollNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        status,
      });

      res.json({
        success: true,
        message: "Student updated successfully",
        data: student,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to update student",
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/v1/students/:id
   * Delete student (Admin only)
   */
  async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Student ID is required");
      }

      await studentService.deleteStudent(id);

      res.json({
        success: true,
        message: "Student deleted successfully",
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to delete student",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/v1/students/:id/stats
   * Get student statistics
   */
  async getStudentStats(req: Request, res: Response): Promise<void> {
    try {
      const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (!id || !id.trim()) {
        throw new ValidationError("Student ID is required");
      }

      const stats = await studentService.getStudentStats(id);

      res.json({
        success: true,
        message: "Student statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to retrieve student statistics",
        error: error.message,
      });
    }
  }
}

export const studentController = new StudentController();
