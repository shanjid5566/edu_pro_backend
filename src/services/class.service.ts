import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import {
  CreateClassInput,
  UpdateClassInput,
  ClassResponse,
  ClassWithStats,
  ClassListResponse,
  ClassStatistics,
  BulkCreateClassesInput,
  BulkCreateClassesResponse,
  AssignSubjectsInput,
} from "../types/class.dto.js";

export class ClassService {
  /**
   * Create a new class
   */
  async createClass(input: CreateClassInput): Promise<ClassResponse> {
    // Validate required fields
    if (!input.name || !input.name.trim()) {
      throw new BadRequestError("Class name is required");
    }

    if (!input.section || !input.section.trim()) {
      throw new BadRequestError("Section is required");
    }

    if (!input.classTeacherId || !input.classTeacherId.trim()) {
      throw new BadRequestError("Class teacher ID is required");
    }

    // Check if teacher exists
    const teacher = await db.teacher.findUnique({
      where: { id: input.classTeacherId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundError(`Teacher with ID ${input.classTeacherId} not found`);
    }

    // Check if class with same name and section already exists
    const existingClass = await db.class.findFirst({
      where: {
        AND: [{ name: input.name.trim() }, { section: input.section.trim() }],
      },
    });

    if (existingClass) {
      throw new BadRequestError(`Class ${input.name} ${input.section} already exists`);
    }

    const classRecord = await db.class.create({
      data: {
        name: input.name.trim(),
        section: input.section.trim(),
        classTeacherId: input.classTeacherId,
        capacity: input.capacity || 40,
      },
      include: {
        classTeacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      id: classRecord.id,
      name: classRecord.name,
      section: classRecord.section,
      classTeacherId: classRecord.classTeacherId,
      capacity: classRecord.capacity,
      classTeacher: classRecord.classTeacher ? {
        id: classRecord.classTeacher.user.id,
        name: classRecord.classTeacher.user.name,
        email: classRecord.classTeacher.user.email,
      } : undefined,
    };
  }

  /**
   * Get class by ID
   */
  async getClassById(id: string): Promise<ClassWithStats> {
    const classRecord = await db.class.findUnique({
      where: { id },
      include: {
        classTeacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        students: true,
      },
    });

    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${id} not found`);
    }

    const totalStudents = classRecord.students.length;
    const capacityPercentage = Math.round((totalStudents / classRecord.capacity) * 100);

    return {
      id: classRecord.id,
      name: classRecord.name,
      section: classRecord.section,
      classTeacherId: classRecord.classTeacherId,
      capacity: classRecord.capacity,
      classTeacher: classRecord.classTeacher ? {
        id: classRecord.classTeacher.user.id,
        name: classRecord.classTeacher.user.name,
        email: classRecord.classTeacher.user.email,
      } : undefined,
      subjects: classRecord.subjects.map((cs) => ({
        id: cs.subject.id,
        name: cs.subject.name,
        code: cs.subject.code,
      })),
      totalStudents,
      capacityPercentage,
    };
  }

  /**
   * Get all classes with pagination and filters
   */
  async getClasses(page: number = 1, pageSize: number = 10, search?: string): Promise<ClassListResponse> {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { section: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const total = await db.class.count({ where });

    const classes = await db.class.findMany({
      where,
      include: {
        classTeacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        students: true,
      },
      skip,
      take: pageSize,
      orderBy: [{ name: "asc" }, { section: "asc" }],
    });

    return {
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section,
        classTeacherId: c.classTeacherId,
        capacity: c.capacity,
        classTeacher: c.classTeacher ? {
          id: c.classTeacher.user.id,
          name: c.classTeacher.user.name,
          email: c.classTeacher.user.email,
        } : undefined,
        subjects: c.subjects.map((cs) => ({
          id: cs.subject.id,
          name: cs.subject.name,
          code: cs.subject.code,
        })),
        totalStudents: c.students.length,
        capacityPercentage: Math.round((c.students.length / c.capacity) * 100),
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Update class
   */
  async updateClass(id: string, input: UpdateClassInput): Promise<ClassResponse> {
    // Check if class exists
    const existing = await db.class.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Class with ID ${id} not found`);
    }

    // Validate inputs
    if (input.name && !input.name.trim()) {
      throw new BadRequestError("Class name cannot be empty");
    }

    if (input.section && !input.section.trim()) {
      throw new BadRequestError("Section cannot be empty");
    }

    if (input.capacity && input.capacity <= 0) {
      throw new BadRequestError("Capacity must be greater than 0");
    }

    // If updating teacher, validate teacher exists
    if (input.classTeacherId) {
      const teacher = await db.teacher.findUnique({
        where: { id: input.classTeacherId },
      });
      if (!teacher) {
        throw new NotFoundError(`Teacher with ID ${input.classTeacherId} not found`);
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (input.name !== undefined) {
      updateData.name = input.name.trim();
    }
    if (input.section !== undefined) {
      updateData.section = input.section.trim();
    }
    if (input.classTeacherId !== undefined) {
      updateData.classTeacherId = input.classTeacherId;
    }
    if (input.capacity !== undefined) {
      updateData.capacity = input.capacity;
    }

    const classRecord = await db.class.update({
      where: { id },
      data: updateData,
      include: {
        classTeacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      id: classRecord.id,
      name: classRecord.name,
      section: classRecord.section,
      classTeacherId: classRecord.classTeacherId,
      capacity: classRecord.capacity,
      classTeacher: classRecord.classTeacher ? {
        id: classRecord.classTeacher.user.id,
        name: classRecord.classTeacher.user.name,
        email: classRecord.classTeacher.user.email,
      } : undefined,
    };
  }

  /**
   * Delete class
   */
  async deleteClass(id: string): Promise<void> {
    const classRecord = await db.class.findUnique({ where: { id } });
    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${id} not found`);
    }

    // Delete related class subjects
    await db.classSubject.deleteMany({
      where: { classId: id },
    });

    await db.class.delete({ where: { id } });
  }

  /**
   * Assign subjects to class
   */
  async assignSubjects(classId: string, input: AssignSubjectsInput): Promise<ClassWithStats> {
    // Check if class exists
    const classRecord = await db.class.findUnique({ where: { id: classId } });
    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    if (!Array.isArray(input.subjectIds) || input.subjectIds.length === 0) {
      throw new BadRequestError("Subject IDs array is required and must not be empty");
    }

    // Verify all subjects exist
    const subjects = await db.subject.findMany({
      where: { id: { in: input.subjectIds } },
    });

    if (subjects.length !== input.subjectIds.length) {
      throw new BadRequestError("One or more subject IDs are invalid");
    }

    // Delete existing subjects and assign new ones
    await db.classSubject.deleteMany({ where: { classId } });

    await db.classSubject.createMany({
      data: input.subjectIds.map((subjectId) => ({
        classId,
        subjectId,
      })),
    });

    return this.getClassById(classId);
  }

  /**
   * Get class statistics
   */
  async getStatistics(): Promise<ClassStatistics> {
    const classes = await db.class.findMany({
      include: {
        students: true,
      },
    });

    const total = classes.length;

    // Calculate capacity usage
    let totalCapacityUsage = 0;
    let totalCapacity = 0;
    classes.forEach((c) => {
      totalCapacity += c.capacity;
      totalCapacityUsage += c.students.length;
    });
    const avgCapacityUsage = total > 0 ? Math.round((totalCapacityUsage / totalCapacity) * 100) : 0;

    // Calculate average students per class
    const avgStudentsPerClass = total > 0 ? Math.round(totalCapacityUsage / total) : 0;

    // Group by section
    const sectionMap = new Map<string, { count: number; students: number }>();
    classes.forEach((c) => {
      if (!sectionMap.has(c.section)) {
        sectionMap.set(c.section, { count: 0, students: 0 });
      }
      const section = sectionMap.get(c.section)!;
      section.count++;
      section.students += c.students.length;
    });

    const bySection = Array.from(sectionMap.entries()).map(([section, data]) => ({
      section,
      classCount: data.count,
      totalStudents: data.students,
    }));

    // Capacity status
    const capacityStatus = {
      underutilized: 0,
      optimal: 0,
      full: 0,
    };

    classes.forEach((c) => {
      const usage = (c.students.length / c.capacity) * 100;
      if (usage < 50) {
        capacityStatus.underutilized++;
      } else if (usage <= 90) {
        capacityStatus.optimal++;
      } else {
        capacityStatus.full++;
      }
    });

    return {
      total,
      avgCapacityUsage,
      avgStudentsPerClass,
      bySection,
      capacityStatus,
    };
  }

  /**
   * Bulk create classes
   */
  async bulkCreateClasses(input: BulkCreateClassesInput): Promise<BulkCreateClassesResponse> {
    let successful = 0;
    let failed = 0;
    const errors: any[] = [];

    for (let i = 0; i < input.classes.length; i++) {
      try {
        await this.createClass(input.classes[i]);
        successful++;
      } catch (error: any) {
        failed++;
        errors.push({
          index: i,
          error: error.message || "Failed to create class",
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
   * Search classes
   */
  async searchClasses(query: string, page: number = 1, pageSize: number = 10): Promise<ClassListResponse> {
    if (!query || !query.trim()) {
      throw new BadRequestError("Search query cannot be empty");
    }
    return this.getClasses(page, pageSize, query);
  }

  /**
   * Get class students count
   */
  async getClassStudentCount(classId: string): Promise<number> {
    const classRecord = await db.class.findUnique({
      where: { id: classId },
      include: { students: true },
    });

    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    return classRecord.students.length;
  }
}

export const classService = new ClassService();
