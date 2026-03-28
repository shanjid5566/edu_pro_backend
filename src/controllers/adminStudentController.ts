import { Request, Response } from "express";
import adminStudentService from "../services/adminStudentService";

class AdminStudentController {
  /**
   * Get all students with pagination and filters
   */
  async getAllStudents(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || undefined;
      const classId = (req.query.classId as string) || undefined;
      const status = (req.query.status as string) || undefined;

      const skip = (page - 1) * limit;

      const result = await adminStudentService.getAllStudents({
        skip,
        take: limit,
        search,
        classId,
        status,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get student profile by ID
   */
  async getStudentById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const result = await adminStudentService.getStudentById(id);

      const statusCode = result.success ? 200 : 404;
      return res.status(statusCode).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Create new student
   */
  async createStudent(req: Request, res: Response) {
    try {
      const {
        fullName,
        email,
        password,
        classId,
        section,
        rollNumber,
        dateOfBirth,
        gender,
        phone,
        parentName,
        address,
      } = req.body;

      // Validation
      if (
        !fullName ||
        !email ||
        !password ||
        !classId ||
        !section ||
        !rollNumber
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields (fullName, email, password, classId, section, rollNumber)",
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      const result = await adminStudentService.createStudent({
        fullName,
        email,
        password,
        classId,
        section,
        rollNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        parentName,
        address,
      });

      const statusCode = result.success ? 201 : 400;
      return res.status(statusCode).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Update student
   */
  async updateStudent(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updateData = req.body;

      const result = await adminStudentService.updateStudent(id, updateData);

      const statusCode = result.success ? 200 : 404;
      return res.status(statusCode).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete student
   */
  async deleteStudent(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const result = await adminStudentService.deleteStudent(id);

      const statusCode = result.success ? 200 : 404;
      return res.status(statusCode).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get students by class
   */
  async getStudentsByClass(req: Request, res: Response) {
    try {
      const classId = Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId;

      const result = await adminStudentService.getStudentsByClass(classId);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Search students
   */
  async searchStudents(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await adminStudentService.searchStudents(
        query as string,
        limit
      );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Export students to CSV
   */
  async exportStudentsToCSV(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10000;
      const search = (req.query.search as string) || undefined;
      const classId = (req.query.classId as string) || undefined;
      const status = (req.query.status as string) || undefined;

      const skip = (page - 1) * limit;

      const result = await adminStudentService.exportStudentsToCSV({
        skip,
        take: limit,
        search,
        classId,
        status,
      });

      if (result.success) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=students.csv"
        );
        return res.send(result.data);
      }

      return res.status(400).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all classes
   */
  async getAllClasses(req: Request, res: Response) {
    try {
      const result = await adminStudentService.getAllClasses();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AdminStudentController();
