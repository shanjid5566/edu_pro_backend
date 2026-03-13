/**
 * Teacher DTO (Data Transfer Objects)
 * Defines request/response types for teacher APIs
 */
export interface CreateTeacherInput {
    name: string;
    email: string;
    password: string;
    phone?: string;
    department: string;
    subjects?: string[];
    classes?: string[];
    joinDate?: Date;
    avatar?: string;
}
export interface UpdateTeacherInput {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    subjects?: string[];
    classes?: string[];
    avatar?: string;
    status?: "active" | "inactive";
}
export interface AssignClassesInput {
    teacherId: string;
    classIds: string[];
}
export interface AssignSubjectsInput {
    teacherId: string;
    subjectIds: string[];
}
export interface TeacherResponse {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: string;
    department: string;
    joinDate: Date;
    classesTaken: number;
    subjects?: {
        id: string;
        name: string;
        code: string;
    }[];
    classes?: {
        id: string;
        name: string;
        section: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface TeacherStatistics {
    totalClasses: number;
    totalSubjects: number;
    attendance: number;
    classesConducated: number;
}
export interface TeacherWithStats extends TeacherResponse {
    stats: TeacherStatistics;
}
export interface TeacherListResponse {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    data: TeacherResponse[];
}
export interface BulkCreateTeachersInput {
    teachers: CreateTeacherInput[];
}
export interface BulkCreateTeachersResponse {
    success: number;
    failed: number;
    message: string;
}
//# sourceMappingURL=teacher.dto.d.ts.map