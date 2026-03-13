/**
 * Teacher Service
 * Business logic for teacher management
 */

import { db } from "../config/database.config";
import { BadRequestError, NotFoundError } from "../utils/errors";
import {
  CreateTeacherInput,
  UpdateTeacherInput,
  TeacherResponse,
  TeacherWithStats,
  TeacherListResponse,
  AssignClassesInput,
  AssignSubjectsInput,
} from "../types/teacher.dto";
import bcrypt from "bcryptjs";

export class TeacherService {
  /**
   * Get all teachers with pagination and search
   */
  async getTeachers(
    page: number,
    pageSize: number,
    search?: string,
    department?: string,
    status?: string
  ): Promise<TeacherListResponse> {
    const skip = (page - 1) * pageSize;

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    if (department) {
      whereCondition.department = { contains: department, mode: "insensitive" };
    }

    if (status) {
      const normalizedStatus = status.toLowerCase();
      if (!["active", "inactive"].includes(normalizedStatus)) {
        throw new BadRequestError("Status must be either active or inactive");
      }

      whereCondition.user = {
        ...(whereCondition.user ?? {}),
        status: normalizedStatus,
      };
    }

    const [teachers, total] = await Promise.all([
      db.teacher.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              status: true,
              createdAt: true,
              updatedAt: true,
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
          classes: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  section: true,
                },
              },
            },
          },
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      }),
      db.teacher.count({ where: whereCondition }),
    ]);

    const data = teachers.map((teacher) => this.mapTeacherToResponse(teacher));

    return {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data,
    };
  }

  /**
   * Get single teacher by ID
   */
  async getTeacherById(id: string): Promise<TeacherWithStats> {
    const teacher = await db.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            status: true,
            createdAt: true,
            updatedAt: true,
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
        classes: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                section: true,
              },
            },
          },
        },
        attendancesMarked: {
          select: {
            id: true,
          },
        },
        classTeacherOf: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    const response = this.mapTeacherToResponse(teacher);

    // Calculate stats
    const stats = {
      totalClasses: teacher.classes.length,
      totalSubjects: teacher.subjects.length,
      attendance: 0, // Will be calculated from attendance records
      classesConducated: teacher.classesTaken,
    };

    return {
      ...response,
      stats,
    };
  }

  /**
   * Create new teacher
   */
  async createTeacher(input: CreateTeacherInput): Promise<TeacherResponse> {
    // Validate required fields
    if (!input.name || !input.name.trim()) {
      throw new BadRequestError("Name is required");
    }

    if (!input.email || !input.email.trim()) {
      throw new BadRequestError("Email is required");
    }

    if (!input.password || input.password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long");
    }

    if (!input.department || !input.department.trim()) {
      throw new BadRequestError("Department is required");
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user and teacher in transaction
    const user = await db.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: hashedPassword,
        phone: input.phone?.trim(),
        avatar: input.avatar,
        role: "TEACHER",
        status: "active",
        teacher: {
          create: {
            department: input.department.trim(),
            joinDate: input.joinDate || new Date(),
          },
        },
      },
      include: {
        teacher: {
          include: {
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
            classes: {
              include: {
                class: {
                  select: {
                    id: true,
                    name: true,
                    section: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const teacher = user.teacher!;

    // Assign subjects if provided
    if (input.subjects && input.subjects.length > 0) {
      await this.assignSubjects({
        teacherId: teacher.id,
        subjectIds: input.subjects,
      });
    }

    // Assign classes if provided
    if (input.classes && input.classes.length > 0) {
      await this.assignClasses({
        teacherId: teacher.id,
        classIds: input.classes,
      });
    }

    return {
      id: teacher.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      avatar: user.avatar || undefined,
      status: user.status,
      department: teacher.department,
      joinDate: teacher.joinDate,
      classesTaken: teacher.classesTaken,
      subjects: teacher.subjects?.map((ts) => ({
        id: ts.subject.id,
        name: ts.subject.name,
        code: ts.subject.code,
      })),
      classes: teacher.classes?.map((tc) => ({
        id: tc.class.id,
        name: tc.class.name,
        section: tc.class.section,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update teacher information
   */
  async updateTeacher(id: string, input: UpdateTeacherInput): Promise<TeacherResponse> {
    const teacher = await db.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Update user information
    const updatedUser = await db.user.update({
      where: { id: teacher.userId },
      data: {
        name: input.name ? input.name.trim() : undefined,
        phone: input.phone ? input.phone.trim() : undefined,
        avatar: input.avatar,
        status: input.status,
      },
      include: {
        teacher: {
          include: {
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
            classes: {
              include: {
                class: {
                  select: {
                    id: true,
                    name: true,
                    section: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const updatedTeacher = updatedUser.teacher!;

    // Update department if provided
    if (input.department) {
      await db.teacher.update({
        where: { id },
        data: {
          department: input.department.trim(),
        },
      });
    }

    // Update subjects if provided
    if (input.subjects) {
      await this.assignSubjects({
        teacherId: id,
        subjectIds: input.subjects,
      });
    }

    // Update classes if provided
    if (input.classes) {
      await this.assignClasses({
        teacherId: id,
        classIds: input.classes,
      });
    }

    return {
      id: updatedTeacher.id,
      userId: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || undefined,
      avatar: updatedUser.avatar || undefined,
      status: updatedUser.status,
      department: updatedTeacher.department,
      joinDate: updatedTeacher.joinDate,
      classesTaken: updatedTeacher.classesTaken,
      subjects: updatedTeacher.subjects?.map((ts) => ({
        id: ts.subject.id,
        name: ts.subject.name,
        code: ts.subject.code,
      })),
      classes: updatedTeacher.classes?.map((tc) => ({
        id: tc.class.id,
        name: tc.class.name,
        section: tc.class.section,
      })),
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Delete teacher
   */
  async deleteTeacher(id: string): Promise<void> {
    const teacher = await db.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Delete user which cascades to teacher
    await db.user.delete({
      where: { id: teacher.userId },
    });
  }

  /**
   * Assign subjects to teacher
   */
  async assignSubjects(input: AssignSubjectsInput): Promise<void> {
    const teacher = await db.teacher.findUnique({
      where: { id: input.teacherId },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Clear existing subjects
    await db.teacherSubject.deleteMany({
      where: { teacherId: input.teacherId },
    });

    // Verify subjects exist
    const subjects = await db.subject.findMany({
      where: { id: { in: input.subjectIds } },
    });

    if (subjects.length !== input.subjectIds.length) {
      throw new BadRequestError("Some subjects do not exist");
    }

    // Assign new subjects
    await db.teacherSubject.createMany({
      data: input.subjectIds.map((subjectId) => ({
        teacherId: input.teacherId,
        subjectId,
      })),
    });
  }

  /**
   * Assign classes to teacher
   */
  async assignClasses(input: AssignClassesInput): Promise<void> {
    const teacher = await db.teacher.findUnique({
      where: { id: input.teacherId },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Clear existing classes
    await db.teacherClass.deleteMany({
      where: { teacherId: input.teacherId },
    });

    // Verify classes exist
    const classes = await db.class.findMany({
      where: { id: { in: input.classIds } },
    });

    if (classes.length !== input.classIds.length) {
      throw new BadRequestError("Some classes do not exist");
    }

    // Assign new classes
    await db.teacherClass.createMany({
      data: input.classIds.map((classId) => ({
        teacherId: input.teacherId,
        classId,
      })),
    });

    // Update classesTaken count
    await db.teacher.update({
      where: { id: input.teacherId },
      data: {
        classesTaken: classes.length,
      },
    });
  }

  /**
   * Get teacher statistics
   */
  async getTeacherStats(id: string) {
    const teacher = await db.teacher.findUnique({
      where: { id },
      include: {
        classes: true,
        subjects: true,
        attendancesMarked: true,
      },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Calculate attendance percentage
    const totalAttendance = teacher.attendancesMarked.length;
    const attendancePercentage = totalAttendance > 0 ? 95 : 0; // Example logic

    return {
      totalClasses: teacher.classes.length,
      totalSubjects: teacher.subjects.length,
      attendance: attendancePercentage,
      classesConducated: teacher.classesTaken,
    };
  }

  /**
   * Map teacher database record to response DTO
   */
  private mapTeacherToResponse(teacher: any): TeacherResponse {
    return {
      id: teacher.id,
      userId: teacher.userId,
      name: teacher.user.name,
      email: teacher.user.email,
      phone: teacher.user.phone || undefined,
      avatar: teacher.user.avatar || undefined,
      status: teacher.user.status,
      department: teacher.department,
      joinDate: teacher.joinDate,
      classesTaken: teacher.classesTaken,
      subjects: teacher.subjects?.map((ts: any) => ({
        id: ts.subject.id,
        name: ts.subject.name,
        code: ts.subject.code,
      })),
      classes: teacher.classes?.map((tc: any) => ({
        id: tc.class.id,
        name: tc.class.name,
        section: tc.class.section,
      })),
      createdAt: teacher.user.createdAt,
      updatedAt: teacher.user.updatedAt,
    };
  }
}

export const teacherService = new TeacherService();
