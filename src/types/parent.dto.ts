/**
 * Parent Request/Response DTOs
 */

// ========================
// Create Parent
// ========================

export interface CreateParentInput {
  name: string;
  email: string;
  phone: string;
  occupation?: string;
  password?: string;
}

// ========================
// Update Parent
// ========================

export interface UpdateParentInput {
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  status?: string;
}

// ========================
// Parent Response
// ========================

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

// ========================
// Parent with Students
// ========================

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

// ========================
// Parent List Response
// ========================

export interface ParentListResponse {
  parents: ParentWithStudents[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ========================
// Parent Statistics
// ========================

export interface ParentStatistics {
  total: number;
  active: number;
  inactive: number;
  avgChildrenPerParent: number;
  parentsWithMultipleChildren: number;
}

// ========================
// Assign Student to Parent
// ========================

export interface AssignStudentInput {
  studentIds: string[];
}

// ========================
// Bulk Create Parents
// ========================

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
