/**
 * Dashboard DTO (Data Transfer Objects)
 * Defines request/response types for dashboard APIs
 */
export interface DashboardOverview {
    totalStudents: number;
    studentsTrendThisMonth: number;
    totalTeachers: number;
    teachersTrendThisMonth: number;
    totalClasses: number;
    newSectionsThisMonth: number;
    totalParents: number;
    parentsTrendThisMonth: number;
}
export interface AttendanceTrendData {
    month: string;
    percentage: number;
}
export interface AttendanceTrendResponse {
    data: AttendanceTrendData[];
}
export interface PerformanceBySubject {
    subject: string;
    percentage: number;
}
export interface PerformanceBySubjectResponse {
    data: PerformanceBySubject[];
}
export interface TodaysAttendance {
    present: number;
    presentPercentage: number;
    absent: number;
    absentPercentage: number;
    late: number;
    latePercentage: number;
    total: number;
}
export interface RecentActivityItem {
    id: string;
    type: "student_enrolled" | "exam_published" | "meeting_scheduled" | "attendance_marked" | "fee_payment" | "notice_posted";
    title: string;
    description: string;
    timestamp: Date;
    relatedUser?: {
        id: string;
        name: string;
        avatar?: string;
    };
    metadata?: {
        classId?: string;
        className?: string;
        studentId?: string;
        studentName?: string;
        teacherId?: string;
        teacherName?: string;
    };
}
export interface RecentActivityResponse {
    data: RecentActivityItem[];
    total: number;
}
export interface AdminDashboardResponse {
    overview: DashboardOverview;
    attendanceTrend: AttendanceTrendData[];
    performanceBySubject: PerformanceBySubject[];
    todaysAttendance: TodaysAttendance;
    recentActivity: RecentActivityItem[];
}
export interface ClassStatistics {
    classId: string;
    className: string;
    section: string;
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    averageAttendance: number;
}
export interface ClassStatisticsResponse {
    data: ClassStatistics[];
    total: number;
}
export interface TeacherPerformance {
    teacherId: string;
    teacherName: string;
    department: string;
    totalClasses: number;
    totalSubjects: number;
    averageAttendance: number;
    classesConducated: number;
}
export interface TeacherPerformanceResponse {
    data: TeacherPerformance[];
    total: number;
}
export interface StudentPerformance {
    studentId: string;
    studentName: string;
    className: string;
    section: string;
    rollNumber: string;
    attendance: number;
    averageGrade: string;
    performance: "excellent" | "good" | "average" | "poor";
}
export interface StudentPerformanceResponse {
    data: StudentPerformance[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface FeeCollectionSummary {
    totalExpected: number;
    totalCollected: number;
    totalPending: number;
    collectionPercentage: number;
    pendingAmount: number;
}
export interface ExamSummary {
    totalExams: number;
    upcomingExams: number;
    completedExams: number;
    averageScore: number;
}
//# sourceMappingURL=dashboard.dto.d.ts.map