/**
 * Exam Request/Response DTOs
 */
export type ExamStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type ExamType = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";
export interface CreateExamInput {
    name: string;
    classId: string;
    subjectId: string;
    date: Date;
    duration: string;
    totalMarks: number;
    type: ExamType;
    status?: ExamStatus;
}
export interface UpdateExamInput {
    name?: string;
    date?: Date;
    duration?: string;
    totalMarks?: number;
    type?: ExamType;
    status?: ExamStatus;
}
export interface ExamResponse {
    id: string;
    name: string;
    classId: string;
    subjectId: string;
    date: Date;
    duration: string;
    totalMarks: number;
    type: ExamType;
    status: ExamStatus;
    class: {
        id: string;
        name: string;
        section: string;
    };
    subject: {
        id: string;
        name: string;
        code: string;
    };
}
export interface ExamListResponse {
    exams: ExamResponse[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
export interface ExamStatistics {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    byClass: {
        classId: string;
        className: string;
        examCount: number;
    }[];
    byType: {
        type: ExamType;
        count: number;
    }[];
}
export interface ExamWithResults {
    exam: ExamResponse;
    totalStudents: number;
    studentsAppeared: number;
    averageMarks: number;
    passPercentage: number;
}
export interface BulkCreateExamsInput {
    exams: CreateExamInput[];
}
export interface BulkCreateExamsResponse {
    total: number;
    successful: number;
    failed: number;
    errors?: {
        index: number;
        error: string;
    }[];
}
//# sourceMappingURL=exam.dto.d.ts.map