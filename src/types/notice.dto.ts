/**
 * Notice Request/Response DTOs
 */

// ========================
// Notice Category Enum
// ========================

export type NoticeCategory = "GENERAL" | "EXAM" | "EVENT" | "HOLIDAY";
export type NoticePriority = "NORMAL" | "HIGH" | "URGENT";

// ========================
// Create Notice
// ========================

export interface CreateNoticeInput {
  title: string;
  message: string;
  category: NoticeCategory;
  priority?: NoticePriority;
  pinned?: boolean;
}

// ========================
// Update Notice
// ========================

export interface UpdateNoticeInput {
  title?: string;
  message?: string;
  category?: NoticeCategory;
  priority?: NoticePriority;
  pinned?: boolean;
}

// ========================
// Notice Response
// ========================

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

// ========================
// Notice List Response
// ========================

export interface NoticeListResponse {
  notices: NoticeResponse[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ========================
// Pin/Unpin Notice
// ========================

export interface PinNoticeInput {
  pinned: boolean;
}
