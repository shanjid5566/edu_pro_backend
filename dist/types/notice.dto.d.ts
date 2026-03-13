/**
 * Notice Request/Response DTOs
 */
export type NoticeCategory = "GENERAL" | "EXAM" | "EVENT" | "HOLIDAY";
export type NoticePriority = "NORMAL" | "HIGH" | "URGENT";
export interface CreateNoticeInput {
    title: string;
    message: string;
    category: NoticeCategory;
    priority?: NoticePriority;
    pinned?: boolean;
}
export interface UpdateNoticeInput {
    title?: string;
    message?: string;
    category?: NoticeCategory;
    priority?: NoticePriority;
    pinned?: boolean;
}
export interface NoticeResponse {
    id: string;
    title: string;
    message: string;
    category: NoticeCategory;
    priority: NoticePriority;
    pinned: boolean;
    createdBy: string;
    createdAt: Date;
    author: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
export interface NoticeListResponse {
    notices: NoticeResponse[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
export interface PinNoticeInput {
    pinned: boolean;
}
//# sourceMappingURL=notice.dto.d.ts.map