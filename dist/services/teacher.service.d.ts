/**
 * Teacher Service
 * Business logic for teacher management
 */
import { CreateTeacherInput, UpdateTeacherInput, TeacherResponse, TeacherWithStats, TeacherListResponse, AssignClassesInput, AssignSubjectsInput } from "../types/teacher.dto.js";
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
     * Get teacher profile by authenticated user ID
     */
    getTeacherByUserId(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        subjects: ({
            subject: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            teacherId: string;
            subjectId: string;
        })[];
        classes: ({
            class: {
                subjects: ({
                    subject: {
                        id: string;
                        name: string;
                    };
                } & {
                    id: string;
                    subjectId: string;
                    classId: string;
                })[];
                students: {
                    id: string;
                }[];
            } & {
                id: string;
                name: string;
                section: string;
                classTeacherId: string | null;
                capacity: number;
            };
        } & {
            id: string;
            teacherId: string;
            classId: string;
        })[];
    } & {
        id: string;
        userId: string;
        department: string;
        joinDate: Date;
        classesTaken: number;
    }>;
    /**
     * Get classes assigned to authenticated teacher
     */
    getTeacherClasses(userId: string): Promise<any>;
    /**
     * Get daily schedule for authenticated teacher
     */
    getTeacherSchedule(userId: string, date?: Date): Promise<any>;
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