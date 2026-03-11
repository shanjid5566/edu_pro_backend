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
export declare class ClassController {
    /**
     * GET /api/v1/classes
     * Get all classes with pagination
     */
    getClasses(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/classes/:id
     * Get single class
     */
    getClassById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/classes
     * Create class (Admin only)
     */
    createClass(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/classes/:id
     * Update class (Admin only)
     */
    updateClass(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/classes/:id
     * Delete class (Admin only)
     */
    deleteClass(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/classes/stats
     * Get class statistics
     */
    getStatistics(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/classes/:id/subjects
     * Assign subjects to class
     */
    assignSubjects(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/classes/bulk
     * Bulk create classes (Admin only)
     */
    bulkCreateClasses(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/classes/search/:query
     * Search classes
     */
    searchClasses(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/classes/:id/students/count
     * Get student count for a class
     */
    getStudentCount(req: Request, res: Response): Promise<void>;
}
export declare const classController: ClassController;
//# sourceMappingURL=class.controller.d.ts.map