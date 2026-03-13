/**
 * Student Service
 * Business logic for student management
 */
import { CreateStudentInput, UpdateStudentInput, StudentResponse, StudentWithStats, StudentListResponse, StudentClassListResponse } from "../types/student.dto";
export declare class StudentService {
    /**
     * Get all students with pagination and search
     */
    getStudents(page: number, pageSize: number, search?: string, classId?: string, section?: string, className?: string, status?: string): Promise<StudentListResponse>;
    /**
     * Get students by class
     */
    getStudentsByClass(classId: string, page: number, pageSize: number): Promise<StudentClassListResponse>;
    /**
     * Get single student by ID
     */
    getStudentById(id: string): Promise<StudentWithStats>;
    /**
     * Create new student
     */
    createStudent(input: CreateStudentInput): Promise<StudentResponse>;
    /**
     * Update student information
     */
    updateStudent(id: string, input: UpdateStudentInput): Promise<StudentResponse>;
    /**
     * Delete student
     */
    deleteStudent(id: string): Promise<void>;
    /**
     * Get student statistics
     */
    getStudentStats(id: string): Promise<{
        attendance: number;
        averageMarks: number;
        totalExams: number;
        totalAttendanceDays: number;
    }>;
    /**
     * Map student database record to response DTO
     */
    private mapStudentToResponse;
}
export declare const studentService: StudentService;
//# sourceMappingURL=student.service.d.ts.map