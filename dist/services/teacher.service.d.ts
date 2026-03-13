/**
 * Teacher Service
 * Business logic for teacher management
 */
import { CreateTeacherInput, UpdateTeacherInput, TeacherResponse, TeacherWithStats, TeacherListResponse, AssignClassesInput, AssignSubjectsInput } from "../types/teacher.dto";
export declare class TeacherService {
    /**
     * Get all teachers with pagination and search
     */
    getTeachers(page: number, pageSize: number, search?: string, department?: string, status?: string): Promise<TeacherListResponse>;
    /**
     * Get single teacher by ID
     */
    getTeacherById(id: string): Promise<TeacherWithStats>;
    /**
     * Create new teacher
     */
    createTeacher(input: CreateTeacherInput): Promise<TeacherResponse>;
    /**
     * Update teacher information
     */
    updateTeacher(id: string, input: UpdateTeacherInput): Promise<TeacherResponse>;
    /**
     * Delete teacher
     */
    deleteTeacher(id: string): Promise<void>;
    /**
     * Assign subjects to teacher
     */
    assignSubjects(input: AssignSubjectsInput): Promise<void>;
    /**
     * Assign classes to teacher
     */
    assignClasses(input: AssignClassesInput): Promise<void>;
    /**
     * Get teacher statistics
     */
    getTeacherStats(id: string): Promise<{
        totalClasses: number;
        totalSubjects: number;
        attendance: number;
        classesConducated: number;
    }>;
    /**
     * Map teacher database record to response DTO
     */
    private mapTeacherToResponse;
}
export declare const teacherService: TeacherService;
//# sourceMappingURL=teacher.service.d.ts.map