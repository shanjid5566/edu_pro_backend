/**
 * Attendance Request/Response DTOs
 */
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export interface MarkAttendanceInput {
    studentId: string;
    classId: string;
    date: Date;
    status: AttendanceStatus;
}
export interface UpdateAttendanceInput {
    status?: AttendanceStatus;
    date?: Date;
}
export interface AttendanceResponse {
    id: string;
    studentId: string;
    classId: string;
    date: Date;
    status: AttendanceStatus;
    markedBy: string;
    student: {
        id: string;
        user: {
            email: string;
            name: string;
        };
    };
    class: {
        id: string;
        name: string;
        section: string;
    };
    teacher: {
        id: string;
        user: {
            email: string;
            name: string;
        };
    };
}
export interface AttendanceSummary {
    date: Date;
    total: number;
    present: number;
    absent: number;
    late: number;
    presentPercentage: number;
    absentPercentage: number;
    latePercentage: number;
}
export interface ClassWiseAttendance {
    classId: string;
    className: string;
    present: number;
    absent: number;
    late: number;
    total: number;
    attendanceRate: number;
}
export interface DailyStatistics {
    date: Date;
    summary: AttendanceSummary;
    classWise: ClassWiseAttendance[];
}
export interface AttendanceReport {
    startDate: Date;
    endDate: Date;
    studentId?: string;
    classId?: string;
    totalRecords: number;
    records: AttendanceResponse[];
}
export interface AttendanceListResponse {
    records: AttendanceResponse[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
export interface BulkMarkAttendanceInput {
    classId: string;
    date: Date;
    attendances: {
        studentId: string;
        status: AttendanceStatus;
    }[];
}
export interface BulkMarkAttendanceResponse {
    classId: string;
    date: Date;
    totalMarked: number;
    successful: number;
    failed: number;
    errors?: {
        studentId: string;
        error: string;
    }[];
}
//# sourceMappingURL=attendance.dto.d.ts.map