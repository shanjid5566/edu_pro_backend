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
export declare class AttendanceController {
    /**
     * GET /api/v1/attendance/daily-stats
     * Get daily attendance statistics
     */
    getDailyStats(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance/overview
     * Get attendance summary for today
     */
    getOverview(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance/class-wise
     * Get class-wise attendance breakdown
     */
    getClassWiseAttendance(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance
     * Get attendance records with pagination
     */
    getAttendanceRecords(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance/export
     * Export attendance records as CSV
     */
    exportAttendance(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance/:id
     * Get single attendance record
     */
    getAttendanceById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/attendance
     * Mark attendance for a student
     */
    markAttendance(req: Request, res: Response): Promise<void>;
    /**
     * PUT /api/v1/attendance/:id
     * Update attendance record
     */
    updateAttendance(req: Request, res: Response): Promise<void>;
    /**
     * DELETE /api/v1/attendance/:id
     * Delete attendance record
     */
    deleteAttendance(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/v1/attendance/bulk
     * Bulk mark attendance for a class
     */
    bulkMarkAttendance(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance/student/:studentId/report
     * Get student attendance report
     */
    getStudentReport(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/v1/attendance/student/:studentId/percentage
     * Get student attendance percentage
     */
    getStudentPercentage(req: Request, res: Response): Promise<void>;
}
export declare const attendanceController: AttendanceController;
//# sourceMappingURL=attendance.controller.d.ts.map