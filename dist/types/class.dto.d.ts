/**
 * Class Request/Response DTOs
 */
export interface CreateClassInput {
    name: string;
    section: string;
    classTeacherId: string;
    capacity?: number;
}
export interface UpdateClassInput {
    name?: string;
    section?: string;
    classTeacherId?: string;
    capacity?: number;
}
export interface AssignSubjectsInput {
    subjectIds: string[];
}
export interface TeacherInfo {
    id: string;
    name: string;
    email: string;
}
export interface SubjectInfo {
    id: string;
    name: string;
    code: string;
}
export interface ClassResponse {
    id: string;
    name: string;
    section: string;
    classTeacherId: string | null;
    capacity: number;
    classTeacher?: TeacherInfo;
    subjects?: SubjectInfo[];
    studentCount?: number;
}
export interface ClassWithStats extends ClassResponse {
    totalStudents: number;
    capacityPercentage: number;
    subjects: SubjectInfo[];
}
export interface ClassListResponse {
    classes: ClassWithStats[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
export interface ClassStatistics {
    total: number;
    avgCapacityUsage: number;
    avgStudentsPerClass: number;
    bySection: {
        section: string;
        classCount: number;
        totalStudents: number;
    }[];
    capacityStatus: {
        underutilized: number;
        optimal: number;
        full: number;
    };
}
export interface BulkCreateClassesInput {
    classes: CreateClassInput[];
}
export interface BulkCreateClassesResponse {
    total: number;
    successful: number;
    failed: number;
    errors?: {
        index: number;
        error: string;
    }[];
}
//# sourceMappingURL=class.dto.d.ts.map