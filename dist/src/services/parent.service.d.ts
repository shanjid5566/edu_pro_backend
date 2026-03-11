import { CreateParentInput, UpdateParentInput, ParentResponse, ParentWithStudents, ParentListResponse, ParentStatistics, BulkCreateParentsInput, BulkCreateParentsResponse, AssignStudentInput } from "../types/parent.dto";
export declare class ParentService {
    /**
     * Create a new parent
     */
    createParent(input: CreateParentInput): Promise<ParentResponse>;
    /**
     * Get parent by ID
     */
    getParentById(id: string): Promise<ParentWithStudents>;
    /**
     * Get all parents with pagination and filters
     */
    getParents(page?: number, pageSize?: number, search?: string, status?: string): Promise<ParentListResponse>;
    /**
     * Update parent
     */
    updateParent(id: string, input: UpdateParentInput): Promise<ParentResponse>;
    /**
     * Delete parent
     */
    deleteParent(id: string): Promise<void>;
    /**
     * Search parents by name
     */
    searchParents(query: string, page?: number, pageSize?: number): Promise<ParentListResponse>;
    /**
     * Get parent statistics
     */
    getStatistics(): Promise<ParentStatistics>;
    /**
     * Assign students to parent
     */
    assignStudents(parentId: string, input: AssignStudentInput): Promise<ParentWithStudents>;
    /**
     * Bulk create parents
     */
    bulkCreateParents(input: BulkCreateParentsInput): Promise<BulkCreateParentsResponse>;
}
export declare const parentService: ParentService;
//# sourceMappingURL=parent.service.d.ts.map