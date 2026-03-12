/**
 * Teacher Controller
 * Handles HTTP requests for teacher management
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
export declare class TeacherController {
    /**
     * GET /api/v1/teachers
     * Get all teachers with pagination and optional filtering
     * Query params: page, pageSize, search, department
     */
    getTeachers(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/teachers/:id
     * Get single teacher by ID with statistics
     */
    getTeacherById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/teachers
     * Create new teacher (Admin only)
     * Body: { name, email, password, phone, department, subjects[], classes[], joinDate, avatar }
     */
    createTeacher(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/teachers/:id
     * Update teacher information (Admin only)
     * Body: { name, email, phone, department, subjects[], classes[], status, avatar }
     */
    updateTeacher(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/teachers/:id
     * Delete teacher (Admin only)
     */
    deleteTeacher(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/teachers/:id/assign-subjects
     * Assign subjects to teacher
     * Body: { subjectIds: string[] }
     */
    assignSubjects(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/teachers/:id/assign-classes
     * Assign classes to teacher
     * Body: { classIds: string[] }
     */
    assignClasses(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/teachers/:id/stats
     * Get teacher statistics
     */
    getTeacherStats(req: Request, res: Response): Promise<void>;
}
export declare const teacherController: TeacherController;
//# sourceMappingURL=teacher.controller.d.ts.map