/**
 * Parent Request/Response DTOs
 */
export interface CreateParentInput {
    name: string;
    email: string;
    phone: string;
    occupation?: string;
    password?: string;
}
export interface UpdateParentInput {
    name?: string;
    email?: string;
    phone?: string;
    occupation?: string;
    status?: string;
}
export interface ParentResponse {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    occupation?: string;
    status: string;
    createdAt: Date;
}
export interface StudentInfo {
    id: string;
    name: string;
    rollNumber: string;
    className: string;
    section: string;
}
export interface ParentWithStudents extends ParentResponse {
    students: StudentInfo[];
    studentCount: number;
}
export interface ParentListResponse {
    parents: ParentWithStudents[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
export interface ParentStatistics {
    total: number;
    active: number;
    inactive: number;
    avgChildrenPerParent: number;
    parentsWithMultipleChildren: number;
}
export interface AssignStudentInput {
    studentIds: string[];
}
export interface BulkCreateParentsInput {
    parents: CreateParentInput[];
}
export interface BulkCreateParentsResponse {
    total: number;
    successful: number;
    failed: number;
    errors?: {
        index: number;
        error: string;
    }[];
}
//# sourceMappingURL=parent.dto.d.ts.map