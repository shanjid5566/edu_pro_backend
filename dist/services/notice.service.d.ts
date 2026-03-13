import { CreateNoticeInput, UpdateNoticeInput, NoticeResponse, NoticeListResponse } from "../types/notice.dto.js";
export declare class NoticeService {
    /**
     * Get all notices with pagination and filters
     */
    getAllNotices(page?: number, pageSize?: number, category?: string, sortBy?: "recent" | "oldest" | "pinned"): Promise<NoticeListResponse>;
    /**
     * Get pinned notices
     */
    getPinnedNotices(limit?: number): Promise<NoticeResponse[]>;
    /**
     * Get notices by category
     */
    getNoticesByCategory(category: string, page?: number, pageSize?: number): Promise<NoticeListResponse>;
    /**
     * Get single notice by ID
     */
    getNoticeById(id: string): Promise<NoticeResponse>;
    /**
     * Create new notice (admin only)
     */
    createNotice(input: CreateNoticeInput, userId: string): Promise<NoticeResponse>;
    /**
     * Update notice (admin only)
     */
    updateNotice(id: string, input: UpdateNoticeInput): Promise<NoticeResponse>;
    /**
     * Pin or unpin notice (admin only)
     */
    togglePinNotice(id: string, pinned: boolean): Promise<NoticeResponse>;
    /**
     * Delete notice (admin only)
     */
    deleteNotice(id: string): Promise<void>;
    /**
     * Search notices by title or message
     */
    searchNotices(query: string, page?: number, pageSize?: number): Promise<NoticeListResponse>;
}
export declare const noticeService: NoticeService;
//# sourceMappingURL=notice.service.d.ts.map