import { CreateClassInput, UpdateClassInput, ClassResponse, ClassWithStats, ClassListResponse, ClassStatistics, BulkCreateClassesInput, BulkCreateClassesResponse, AssignSubjectsInput } from "../types/class.dto.js";
export declare class ClassService {
    /**
     * Create a new class
     */
    createClass(input: CreateClassInput): Promise<ClassResponse>;
    /**
     * Get class by ID
     */
    getClassById(id: string): Promise<ClassWithStats>;
    /**
     * Get all classes with pagination and filters
     */
    getClasses(page?: number, pageSize?: number, search?: string): Promise<ClassListResponse>;
    /**
     * Update class
     */
    updateClass(id: string, input: UpdateClassInput): Promise<ClassResponse>;
    /**
     * Delete class
     */
    deleteClass(id: string): Promise<void>;
    /**
     * Assign subjects to class
     */
    assignSubjects(classId: string, input: AssignSubjectsInput): Promise<ClassWithStats>;
    /**
     * Get class statistics
     */
    getStatistics(): Promise<ClassStatistics>;
    /**
     * Bulk create classes
     */
    bulkCreateClasses(input: BulkCreateClassesInput): Promise<BulkCreateClassesResponse>;
    /**
     * Search classes
     */
    searchClasses(query: string, page?: number, pageSize?: number): Promise<ClassListResponse>;
    /**
     * Get class students count
     */
    getClassStudentCount(classId: string): Promise<number>;
}
export declare const classService: ClassService;
//# sourceMappingURL=class.service.d.ts.map