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
export declare class ParentController {
    /**
     * GET /api/v1/parents
     * Get all parents with pagination
     */
    getParents(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/parents/export
     * Export filtered parents as CSV
     */
    exportParents(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/parents/:id
     * Get single parent
     */
    getParentById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/parents
     * Create parent (Admin only)
     */
    createParent(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/parents/:id
     * Update parent (Admin only)
     */
    updateParent(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/parents/:id
     * Delete parent (Admin only)
     */
    deleteParent(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/parents/stats
     * Get parent statistics
     */
    getStatistics(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/parents/:id/students
     * Assign students to parent
     */
    assignStudents(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/parents/bulk
     * Bulk create parents (Admin only)
     */
    bulkCreateParents(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/parents/search/:query
     * Search parents by name
     */
    searchParents(req: Request, res: Response): Promise<void>;
}
export declare const parentController: ParentController;
//# sourceMappingURL=parent.controller.d.ts.map