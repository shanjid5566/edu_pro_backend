/**
 * Student DTO (Data Transfer Objects)
 * Defines request/response types for student APIs
 */
export interface CreateStudentInput {
    name: string;
    email: string;
    password: string;
    phone?: string;
    classId: string;
    section: string;
    rollNumber: string;
    dateOfBirth?: Date;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    parentName?: string;
    parentEmail?: string;
}
export interface UpdateStudentInput {
    name?: string;
    email?: string;
    phone?: string;
    classId?: string;
    section?: string;
    rollNumber?: string;
    dateOfBirth?: Date;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    parentName?: string;
    status?: "active" | "inactive";
}
export interface StudentResponse {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: string;
    class: {
        id: string;
        name: string;
        section: string;
    };
    rollNumber: string;
    dateOfBirth?: Date;
    gender?: string;
    address?: string;
    parent?: {
        id: string;
        name: string;
        email: string;
    };
    admissionDate: Date;
    grade?: string;
    attendance?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface StudentStatistics {
    totalStudents: number;
    activeStudents: number;
    averageAttendance: number;
    averageGrade: string;
}
export interface StudentWithStats extends StudentResponse {
    stats?: {
        attendance: number;
        grade: string;
    };
}
export interface StudentListResponse {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    data: StudentResponse[];
}
export interface StudentClassListResponse {
    classId: string;
    className: string;
    section: string;
    totalStudents: number;
    averageAttendance: number;
    students: StudentResponse[];
}
export interface BulkCreateStudentsInput {
    students: CreateStudentInput[];
}
export interface BulkCreateStudentsResponse {
    success: number;
    failed: number;
    message: string;
}
//# sourceMappingURL=student.dto.d.ts.map