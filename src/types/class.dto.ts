/**
 * Class Request/Response DTOs
 */

// ========================
// Create Class
// ========================

export interface CreateClassInput {
  name: string;
  section: string;
  classTeacherId: string;
  capacity?: number;
}

// ========================
// Update Class
// ========================

export interface UpdateClassInput {
  name?: string;
  section?: string;
  classTeacherId?: string;
  capacity?: number;
}

// ========================
// Class Subject Assignment
// ========================

export interface AssignSubjectsInput {
  subjectIds: string[];
}

// ========================
// Teacher Info
// ========================

export interface TeacherInfo {
  id: string;
  name: string;
  email: string;
}

// ========================
// Subject Info
// ========================

export interface SubjectInfo {
  id: string;
  name: string;
  code: string;
}

// ========================
// Class Response
// ========================

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

// ========================
// Class With Stats
// ========================

export interface ClassWithStats extends ClassResponse {
  totalStudents: number;
  capacityPercentage: number;
  subjects: SubjectInfo[];
}

// ========================
// Class List Response
// ========================

export interface ClassListResponse {
  classes: ClassWithStats[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ========================
// Class Statistics
// ========================

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

// ========================
// Bulk Create Classes
// ========================

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
