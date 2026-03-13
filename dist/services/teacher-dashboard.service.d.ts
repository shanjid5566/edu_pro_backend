export declare class TeacherDashboardService {
    private getMonthLabel;
    private getTeacherByUserId;
    getTeacherDashboard(userId: string): Promise<any>;
    getTeacherClasses(userId: string): Promise<any>;
    getTeacherSchedule(userId: string, date?: Date): Promise<any>;
    getTeacherAttendanceSheet(userId: string, classId: string, date?: Date): Promise<any>;
    saveTeacherAttendanceSheet(userId: string, classId: string, date: Date, attendances: Array<{
        studentId: string;
        status: "PRESENT" | "ABSENT" | "LATE";
    }>): Promise<any>;
    getTeacherRecentAttendance(userId: string, limit?: number): Promise<any>;
    getTeacherExams(userId: string, page?: number, pageSize?: number, status?: string, classId?: string, subjectId?: string): Promise<any>;
    createTeacherExam(userId: string, input: {
        name: string;
        classId: string;
        subjectId: string;
        date: Date;
        duration: string;
        totalMarks: number;
        type: string;
        status?: string;
    }): Promise<any>;
    uploadTeacherQuestionPaper(userId: string, examId: string, fileUrl: string): Promise<any>;
    getTeacherNotices(page?: number, pageSize?: number, category?: string, sortBy?: "recent" | "oldest" | "pinned"): Promise<any>;
    createTeacherNotice(userId: string, input: {
        title: string;
        message: string;
        category: string;
        priority?: string;
        pinned?: boolean;
    }): Promise<any>;
}
export declare const teacherDashboardService: TeacherDashboardService;
//# sourceMappingURL=teacher-dashboard.service.d.ts.map