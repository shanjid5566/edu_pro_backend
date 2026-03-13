/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard data
 */
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
export declare class DashboardController {
    /**
     * GET /api/v1/dashboard
     * Get complete admin dashboard data (overview, charts, activities)
     */
    getDashboard(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/overview
     * Get dashboard overview statistics
     */
    getOverview(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/attendance-trend
     * Get attendance trend data
     */
    getAttendanceTrend(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/performance
     * Get performance by subject
     */
    getPerformanceBySubject(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/todays-attendance
     * Get today's attendance overview
     */
    getTodaysAttendance(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/recent-activity
     * Get recent activity
     * Query params: limit
     */
    getRecentActivity(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/class-statistics
     * Get statistics for all classes
     * Query params: page, pageSize
     */
    getClassStatistics(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/teacher-performance
     * Get teacher performance metrics
     * Query params: page, pageSize
     */
    getTeacherPerformance(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/student-performance
     * Get student performance metrics
     * Query params: page, pageSize, classId
     */
    getStudentPerformance(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/fee-collection
     * Get fee collection summary
     */
    getFeeCollectionSummary(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/dashboard/exam-summary
     * Get exam summary
     */
    getExamSummary(req: Request, res: Response): Promise<void>;
    getTeacherDashboard(req: Request, res: Response): Promise<void>;
}
export declare const dashboardController: DashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map