import { MarkAttendanceInput, UpdateAttendanceInput, AttendanceResponse, AttendanceSummary, ClassWiseAttendance, DailyStatistics, AttendanceReport, AttendanceListResponse, BulkMarkAttendanceInput, BulkMarkAttendanceResponse } from "../types/attendance.dto.js";
export declare class AttendanceService {
    /**
     * Mark attendance for a student
     */
    markAttendance(input: MarkAttendanceInput, markedByUserId: string): Promise<AttendanceResponse>;
    /**
     * Get attendance by ID
     */
    getAttendanceById(id: string): Promise<AttendanceResponse>;
    /**
     * Update attendance record
     */
    updateAttendance(id: string, input: UpdateAttendanceInput): Promise<AttendanceResponse>;
    /**
     * Delete attendance record
     */
    deleteAttendance(id: string): Promise<void>;
    /**
     * Get attendance records with pagination and filters
     */
    getAttendanceRecords(page?: number, pageSize?: number, classId?: string, studentId?: string, startDate?: Date, endDate?: Date, status?: string): Promise<AttendanceListResponse>;
    /**
     * Get attendance summary for a specific date
     */
    getDailySummary(date: Date): Promise<AttendanceSummary>;
    /**
     * Get class-wise attendance for a specific date
     */
    getClassWiseAttendance(date: Date): Promise<ClassWiseAttendance[]>;
    /**
     * Get daily statistics (summary + class-wise)
     */
    getDailyStatistics(date: Date): Promise<DailyStatistics>;
    /**
     * Bulk mark attendance for a class
     */
    bulkMarkAttendance(input: BulkMarkAttendanceInput, markedByUserId: string): Promise<BulkMarkAttendanceResponse>;
    /**
     * Get attendance report for a student
     */
    getStudentAttendanceReport(studentId: string, startDate: Date, endDate: Date): Promise<AttendanceReport>;
    /**
     * Get student attendance percentage
     */
    getStudentAttendancePercentage(studentId: string, startDate?: Date, endDate?: Date): Promise<{
        studentId: string;
        totalDays: number;
        presentDays: number;
        absentDays: number;
        lateDays: number;
        attendancePercentage: number;
    }>;
    /**
     * Get attendance sheet for a teacher's assigned class and date
     */
    getTeacherAttendanceSheet(userId: string, classId: string, date?: Date): Promise<any>;
    /**
     * Save attendance sheet for a teacher's assigned class/date
     */
    saveTeacherAttendanceSheet(userId: string, classId: string, date: Date, attendances: Array<{
        studentId: string;
        status: "PRESENT" | "ABSENT" | "LATE";
    }>): Promise<any>;
    /**
     * Get teacher recent attendance summaries
     */
    getTeacherRecentAttendance(userId: string, limit?: number): Promise<any>;
}
export declare const attendanceService: AttendanceService;
//# sourceMappingURL=attendance.service.d.ts.map