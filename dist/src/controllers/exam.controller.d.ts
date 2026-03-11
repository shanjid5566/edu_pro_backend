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
export declare class ExamController {
    /**
     * GET /api/v1/exams
     * Get all exams with filters
     */
    getExams(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/exams/:id
     * Get single exam
     */
    getExamById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/exams
     * Create exam (Admin only)
     */
    createExam(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/exams/:id
     * Update exam (Admin only)
     */
    updateExam(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/exams/:id
     * Delete exam (Admin only)
     */
    deleteExam(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/exams/stats
     * Get exam statistics
     */
    getStatistics(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/exams/:id/results
     * Get exam with results
     */
    getExamWithResults(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/exams/bulk
     * Bulk create exams (Admin only)
     */
    bulkCreateExams(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/exams/search/:query
     * Search exams
     */
    searchExams(req: Request, res: Response): Promise<void>;
}
export declare const examController: ExamController;
//# sourceMappingURL=exam.controller.d.ts.map