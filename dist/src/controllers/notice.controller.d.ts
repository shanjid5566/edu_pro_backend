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
export declare class NoticeController {
    /**
     * GET /api/v1/notices
     * Get all notices with pagination and filters
     */
    getAllNotices(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/notices/pinned
     * Get pinned notices
     */
    getPinnedNotices(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/notices/category/:category
     * Get notices by category
     */
    getNoticesByCategory(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/notices/:id
     * Get single notice by ID
     */
    getNoticeById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/notices
     * Create new notice (admin only)
     */
    createNotice(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/notices/:id
     * Update notice (admin only)
     */
    updateNotice(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/notices/:id/pin
     * Pin or unpin notice (admin only)
     */
    togglePinNotice(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/notices/:id
     * Delete notice (admin only)
     */
    deleteNotice(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/notices/search/:query
     * Search notices by title or message
     */
    searchNotices(req: Request, res: Response): Promise<void>;
}
export declare const noticeController: NoticeController;
//# sourceMappingURL=notice.controller.d.ts.map