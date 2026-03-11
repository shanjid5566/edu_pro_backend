/**
 * Exam Request/Response DTOs
 */

// ========================
// Exam Status & Type Enums
// ========================

export type ExamStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type ExamType = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";

// ========================
// Create Exam
// ========================

export interface CreateExamInput {
  name: string;
  classId: string;
  subjectId: string;
  date: Date;
  duration: string;
  totalMarks: number;
  type: ExamType;
  status?: ExamStatus;
}

// ========================
// Update Exam
// ========================

export interface UpdateExamInput {
  name?: string;
  date?: Date;
  duration?: string;
  totalMarks?: number;
  type?: ExamType;
  status?: ExamStatus;
}

// ========================
// Exam Response
// ========================

export interface ExamResponse {
  id: string;
  name: string;
  classId: string;
  subjectId: string;
  date: Date;
  duration: string;
  totalMarks: number;
  type: ExamType;
  status: ExamStatus;
  class: {
    id: string;
    name: string;
    section: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
}

// ========================
// Exam List Response
// ========================

export interface ExamListResponse {
  exams: ExamResponse[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ========================
// Exam Statistics
// ========================

export interface ExamStatistics {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  byClass: {
    classId: string;
    className: string;
    examCount: number;
  }[];
  byType: {
    type: ExamType;
    count: number;
  }[];
}

// ========================
// Exam Details with Results
// ========================

export interface ExamWithResults {
  exam: ExamResponse;
  totalStudents: number;
  studentsAppeared: number;
  averageMarks: number;
  passPercentage: number;
}

// ========================
// Bulk Create Exams
// ========================

export interface BulkCreateExamsInput {
  exams: CreateExamInput[];
}

export interface BulkCreateExamsResponse {
  total: number;
  successful: number;
  failed: number;
  errors?: {
    index: number;
    error: string;
  }[];
}
