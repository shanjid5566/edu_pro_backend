/**
 * Student Controller
 * Handles HTTP requests for student management
 */
import { Request, Response } from "express";
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
export declare class StudentController {
    /**
     * GET /api/v1/students
     * Get all students with pagination and optional filtering
     * Query params: page, pageSize, search, classId, section, className, class, status
     */
    getStudents(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/students/export
     * Export filtered students as CSV
     */
    exportStudents(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/students/class/:classId
     * Get students by class
     */
    getStudentsByClass(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/students/:id
     * Get single student by ID with statistics
     */
    getStudentById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/students
     * Create new student (Admin only)
     * Body: { name, email, password, phone, classId, section, rollNumber, dateOfBirth, gender, address, parentName, parentEmail }
     */
    createStudent(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/students/:id
     * Update student information (Admin only)
     * Body: { name, phone, classId, section, rollNumber, dateOfBirth, gender, address, status }
     */
    updateStudent(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/students/:id
     * Delete student (Admin only)
     */
    deleteStudent(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/students/:id/stats
     * Get student statistics
     */
    getStudentStats(req: Request, res: Response): Promise<void>;
}
export declare const studentController: StudentController;
//# sourceMappingURL=student.controller.d.ts.map