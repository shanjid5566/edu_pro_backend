import { CreateExamInput, UpdateExamInput, ExamResponse, ExamListResponse, ExamStatistics, ExamWithResults, BulkCreateExamsInput, BulkCreateExamsResponse } from "../types/exam.dto.js";
export declare class ExamService {
    /**
     * Create a new exam
     */
    createExam(input: CreateExamInput): Promise<ExamResponse>;
    /**
     * Get exam by ID
     */
    getExamById(id: string): Promise<ExamResponse>;
    /**
     * Get all exams with pagination and filters
     */
    getExams(page?: number, pageSize?: number, status?: string, classId?: string, subjectId?: string, type?: string, search?: string): Promise<ExamListResponse>;
    /**
     * Update exam
     */
    updateExam(id: string, input: UpdateExamInput): Promise<ExamResponse>;
    /**
     * Delete exam
     */
    deleteExam(id: string): Promise<void>;
    /**
     * Get exam statistics
     */
    getStatistics(): Promise<ExamStatistics>;
    /**
     * Get exam with results
     */
    getExamWithResults(id: string): Promise<ExamWithResults>;
    /**
     * Bulk create exams
     */
    bulkCreateExams(input: BulkCreateExamsInput): Promise<BulkCreateExamsResponse>;
    /**
     * Get exams by class
     */
    getExamsByClass(classId: string, page?: number, pageSize?: number): Promise<ExamListResponse>;
    /**
     * Get exams by subject
     */
    getExamsBySubject(subjectId: string, page?: number, pageSize?: number): Promise<ExamListResponse>;
    /**
     * Search exams
     */
    searchExams(query: string, page?: number, pageSize?: number): Promise<ExamListResponse>;
}
export declare const examService: ExamService;
//# sourceMappingURL=exam.service.d.ts.map