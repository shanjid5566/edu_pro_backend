/**
 * Dashboard Service
 * Business logic for dashboard data aggregation and statistics
 */
import { AdminDashboardResponse, DashboardOverview, AttendanceTrendData, PerformanceBySubject, TodaysAttendance, RecentActivityItem, ClassStatisticsResponse, TeacherPerformanceResponse, StudentPerformanceResponse, FeeCollectionSummary, ExamSummary } from "../types/dashboard.dto";
export declare class DashboardService {
    /**
     * Get complete admin dashboard data
     */
    getAdminDashboard(): Promise<AdminDashboardResponse>;
    /**
     * Get dashboard overview statistics
     */
    getDashboardOverview(): Promise<DashboardOverview>;
    /**
     * Get attendance trend for last 6 months
     */
    getAttendanceTrend(): Promise<AttendanceTrendData[]>;
    /**
     * Get performance by subject
     */
    getPerformanceBySubject(): Promise<PerformanceBySubject[]>;
    /**
     * Get today's attendance overview
     */
    getTodaysAttendance(): Promise<TodaysAttendance>;
    /**
     * Get recent activity
     */
    getRecentActivity(limit?: number): Promise<RecentActivityItem[]>;
    /**
     * Get class statistics
     */
    getClassStatistics(page?: number, pageSize?: number): Promise<ClassStatisticsResponse>;
    /**
     * Get teacher performance
     */
    getTeacherPerformance(page?: number, pageSize?: number): Promise<TeacherPerformanceResponse>;
    /**
     * Get student performance
     */
    getStudentPerformance(page?: number, pageSize?: number, classId?: string): Promise<StudentPerformanceResponse>;
    /**
     * Get fee collection summary
     */
    getFeeCollectionSummary(): Promise<FeeCollectionSummary>;
    /**
     * Get exam summary
     */
    getExamSummary(): Promise<ExamSummary>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map