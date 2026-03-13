export declare class StudentDashboardService {
    private getMonthLabel;
    private getLetterGrade;
    private getStudentByUserId;
    private getStudentRankInClass;
    getStudentDashboard(userId: string): Promise<any>;
    getStudentClasses(userId: string): Promise<any>;
    getStudentExams(userId: string, status?: string): Promise<any>;
    getStudentResults(userId: string, page?: number, pageSize?: number): Promise<any>;
    getStudentFees(userId: string, status?: "ALL" | "PAID" | "PENDING" | "OVERDUE", page?: number, pageSize?: number): Promise<any>;
    getStudentNotices(page?: number, pageSize?: number, category?: string, sortBy?: "recent" | "oldest" | "pinned"): Promise<any>;
    createStudentNotice(userId: string, input: {
        title: string;
        message: string;
        category: string;
        priority?: string;
        pinned?: boolean;
    }): Promise<any>;
}
export declare const studentDashboardService: StudentDashboardService;
//# sourceMappingURL=student-dashboard.service.d.ts.map