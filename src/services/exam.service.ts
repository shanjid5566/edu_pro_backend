import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { teacherService } from "./teacher.service.js";
import {
  CreateExamInput,
  UpdateExamInput,
  ExamResponse,
  ExamListResponse,
  ExamStatistics,
  ExamWithResults,
  BulkCreateExamsInput,
  BulkCreateExamsResponse,
} from "../types/exam.dto.js";

export class ExamService {
  /**
   * Create a new exam
   */
  async createExam(input: CreateExamInput): Promise<ExamResponse> {
    // Validate required fields
    if (!input.name || !input.name.trim()) {
      throw new BadRequestError("Exam name is required");
    }

    if (!input.classId || !input.classId.trim()) {
      throw new BadRequestError("Class ID is required");
    }

    if (!input.subjectId || !input.subjectId.trim()) {
      throw new BadRequestError("Subject ID is required");
    }

    if (!input.date) {
      throw new BadRequestError("Date is required");
    }

    if (!input.duration || !input.duration.trim()) {
      throw new BadRequestError("Duration is required");
    }

    if (!input.totalMarks || input.totalMarks <= 0) {
      throw new BadRequestError("Total marks must be greater than 0");
    }

    if (!input.type) {
      throw new BadRequestError("Exam type is required");
    }

    const validTypes = ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"];
    if (!validTypes.includes(input.type)) {
      throw new BadRequestError(`Invalid exam type. Must be one of: ${validTypes.join(", ")}`);
    }

    // Check if class exists
    const classRecord = await db.class.findUnique({
      where: { id: input.classId },
    });
    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${input.classId} not found`);
    }

    // Check if subject exists
    const subject = await db.subject.findUnique({
      where: { id: input.subjectId },
    });
    if (!subject) {
      throw new NotFoundError(`Subject with ID ${input.subjectId} not found`);
    }

    const exam = await db.exam.create({
      data: {
        name: input.name.trim(),
        classId: input.classId,
        subjectId: input.subjectId,
        date: new Date(input.date),
        duration: input.duration.trim(),
        totalMarks: input.totalMarks,
        type: input.type as any,
        status: input.status || "UPCOMING",
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return exam as any as ExamResponse;
  }

  /**
   * Get exam by ID
   */
  async getExamById(id: string): Promise<ExamResponse> {
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundError(`Exam with ID ${id} not found`);
    }

    return exam as any as ExamResponse;
  }

  /**
   * Get all exams with pagination and filters
   */
  async getExams(
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    classId?: string,
    subjectId?: string,
    type?: string,
    search?: string
  ): Promise<ExamListResponse> {
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};
    
    if (status) {
      const validStatuses = ["UPCOMING", "ONGOING", "COMPLETED"];
      if (!validStatuses.includes(status.toUpperCase())) {
        throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      }
      where.status = status.toUpperCase();
    }

    if (classId) {
      where.classId = classId;
    }

    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (type) {
      const validTypes = ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"];
      if (!validTypes.includes(type.toUpperCase())) {
        throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(", ")}`);
      }
      where.type = type.toUpperCase();
    }

    if (search) {
      where.name = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const total = await db.exam.count({ where });

    const exams = await db.exam.findMany({
      where,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { date: "desc" },
    });

    return {
      exams: exams as any as ExamResponse[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Update exam
   */
  async updateExam(id: string, input: UpdateExamInput): Promise<ExamResponse> {
    // Check if exam exists
    const existing = await db.exam.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Exam with ID ${id} not found`);
    }

    // Validate inputs
    if (input.name && !input.name.trim()) {
      throw new BadRequestError("Exam name cannot be empty");
    }

    if (input.totalMarks !== undefined && input.totalMarks <= 0) {
      throw new BadRequestError("Total marks must be greater than 0");
    }

    if (input.type) {
      const validTypes = ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"];
      if (!validTypes.includes(input.type)) {
        throw new BadRequestError(`Invalid exam type. Must be one of: ${validTypes.join(", ")}`);
      }
    }

    if (input.status) {
      const validStatuses = ["UPCOMING", "ONGOING", "COMPLETED"];
      if (!validStatuses.includes(input.status)) {
        throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (input.name !== undefined) {
      updateData.name = input.name.trim();
    }
    if (input.date !== undefined) {
      updateData.date = new Date(input.date);
    }
    if (input.duration !== undefined) {
      updateData.duration = input.duration.trim();
    }
    if (input.totalMarks !== undefined) {
      updateData.totalMarks = input.totalMarks;
    }
    if (input.type !== undefined) {
      updateData.type = input.type;
    }
    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    const exam = await db.exam.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return exam as any as ExamResponse;
  }

  /**
   * Delete exam
   */
  async deleteExam(id: string): Promise<void> {
    const exam = await db.exam.findUnique({ where: { id } });
    if (!exam) {
      throw new NotFoundError(`Exam with ID ${id} not found`);
    }

    await db.exam.delete({ where: { id } });
  }

  /**
   * Get exam statistics
   */
  async getStatistics(): Promise<ExamStatistics> {
    const exams = await db.exam.findMany({
      include: {
        class: true,
      },
    });

    const total = exams.length;
    const upcoming = exams.filter((e) => e.status === "UPCOMING").length;
    const ongoing = exams.filter((e) => e.status === "ONGOING").length;
    const completed = exams.filter((e) => e.status === "COMPLETED").length;

    // Group by class
    const classCounts = new Map<string, { class: any; count: number }>();
    exams.forEach((exam) => {
      if (!classCounts.has(exam.classId)) {
        classCounts.set(exam.classId, { class: exam.class, count: 0 });
      }
      classCounts.get(exam.classId)!.count++;
    });

    const byClass = Array.from(classCounts.values()).map((item) => ({
      classId: item.class.id,
      className: `${item.class.name} ${item.class.section}`,
      examCount: item.count,
    }));

    // Group by type
    const typeCounts = new Map<string, number>();
    exams.forEach((exam) => {
      typeCounts.set(exam.type, (typeCounts.get(exam.type) || 0) + 1);
    });

    const byType = Array.from(typeCounts.entries()).map(([type, count]) => ({
      type: type as any,
      count,
    }));

    return {
      total,
      upcoming,
      ongoing,
      completed,
      byClass,
      byType,
    };
  }

  /**
   * Get exam with results
   */
  async getExamWithResults(id: string): Promise<ExamWithResults> {
    const exam = await this.getExamById(id);

    const results = await db.examResult.findMany({
      where: { examId: id },
    });

    const totalStudents = await db.student.count({
      where: { classId: exam.classId },
    });

    const studentsAppeared = results.length;
    const totalMarksObtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
    const averageMarks = studentsAppeared > 0 ? Math.round(totalMarksObtained / studentsAppeared) : 0;

    // Calculate pass percentage (assuming 40% is passing)
    const passingMarks = (exam.totalMarks * 40) / 100;
    const passCount = results.filter((r) => r.marksObtained >= passingMarks).length;
    const passPercentage = studentsAppeared > 0 ? Math.round((passCount / studentsAppeared) * 100) : 0;

    return {
      exam,
      totalStudents,
      studentsAppeared,
      averageMarks,
      passPercentage,
    };
  }

  /**
   * Bulk create exams
   */
  async bulkCreateExams(input: BulkCreateExamsInput): Promise<BulkCreateExamsResponse> {
    let successful = 0;
    let failed = 0;
    const errors: any[] = [];

    for (let i = 0; i < input.exams.length; i++) {
      try {
        await this.createExam(input.exams[i]);
        successful++;
      } catch (error: any) {
        failed++;
        errors.push({
          index: i,
          error: error.message || "Failed to create exam",
        });
      }
    }

    return {
      total: successful + failed,
      successful,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get exams by class
   */
  async getExamsByClass(classId: string, page: number = 1, pageSize: number = 10): Promise<ExamListResponse> {
    return this.getExams(page, pageSize, undefined, classId);
  }

  /**
   * Get exams by subject
   */
  async getExamsBySubject(subjectId: string, page: number = 1, pageSize: number = 10): Promise<ExamListResponse> {
    return this.getExams(page, pageSize, undefined, undefined, subjectId);
  }

  /**
   * Search exams
   */
  async searchExams(query: string, page: number = 1, pageSize: number = 10): Promise<ExamListResponse> {
    if (!query || !query.trim()) {
      throw new BadRequestError("Search query cannot be empty");
    }
    return this.getExams(page, pageSize, undefined, undefined, undefined, undefined, query);
  }

  /**
   * Get exams visible to a teacher (limited to assigned class-subject pairs)
   */
  async getTeacherExams(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    classId?: string,
    subjectId?: string
  ): Promise<any> {
    const teacher = await teacherService.getTeacherByUserId(userId);
    const classIds = teacher.classes.map((tc: { classId: string }) => tc.classId);
    const subjectIds = teacher.subjects.map((ts: { subjectId: string }) => ts.subjectId);

    const allowedClassIds = classId ? [classId].filter((id: string) => classIds.includes(id)) : classIds;
    const allowedSubjectIds = subjectId ? [subjectId].filter((id: string) => subjectIds.includes(id)) : subjectIds;

    const result = await this.getExams(
      page,
      pageSize,
      status,
      allowedClassIds[0] && classId ? classId : undefined,
      allowedSubjectIds[0] && subjectId ? subjectId : undefined
    );

    const exams = result.exams.filter(
      (exam: { classId: string; subjectId: string }) => classIds.includes(exam.classId) && subjectIds.includes(exam.subjectId)
    );

    return {
      exams,
      pagination: result.pagination,
    };
  }

  /**
   * Create exam by teacher for assigned class and subject only
   */
  async createTeacherExam(
    userId: string,
    input: {
      name: string;
      classId: string;
      subjectId: string;
      date: Date;
      duration: string;
      totalMarks: number;
      type: string;
      status?: string;
    }
  ): Promise<any> {
    const teacher = await teacherService.getTeacherByUserId(userId);

    const isClassAllowed = teacher.classes.some((tc: { classId: string }) => tc.classId === input.classId);
    const isSubjectAllowed = teacher.subjects.some((ts: { subjectId: string }) => ts.subjectId === input.subjectId);

    if (!isClassAllowed || !isSubjectAllowed) {
      throw new BadRequestError("You can create exams only for your assigned classes and subjects");
    }

    return this.createExam(input as any);
  }

  /**
   * Upload question paper for teacher-owned exam
   */
  async uploadTeacherQuestionPaper(userId: string, examId: string, fileUrl: string): Promise<any> {
    if (!fileUrl || !fileUrl.trim()) {
      throw new BadRequestError("fileUrl is required");
    }

    const teacher = await teacherService.getTeacherByUserId(userId);
    const exam = await db.exam.findUnique({ where: { id: examId } });

    if (!exam) {
      throw new NotFoundError("Exam not found");
    }

    const isClassAllowed = teacher.classes.some((tc: { classId: string }) => tc.classId === exam.classId);
    const isSubjectAllowed = teacher.subjects.some((ts: { subjectId: string }) => ts.subjectId === exam.subjectId);

    if (!isClassAllowed || !isSubjectAllowed) {
      throw new BadRequestError("You can upload question papers only for your assigned class-subject exams");
    }

    return db.questionPaper.create({
      data: {
        examId,
        teacherId: teacher.id,
        fileUrl: fileUrl.trim(),
        status: "PENDING",
      },
      include: {
        exam: {
          include: {
            class: {
              select: {
                name: true,
                section: true,
              },
            },
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

export const examService = new ExamService();
