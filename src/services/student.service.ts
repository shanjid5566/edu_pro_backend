/**
 * Student Service
 * Business logic for student management
 */

import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import {
  CreateStudentInput,
  UpdateStudentInput,
  StudentResponse,
  StudentWithStats,
  StudentListResponse,
  StudentClassListResponse,
} from "../types/student.dto.js";
import bcrypt from "bcryptjs";

export class StudentService {
  /**
   * Get all students with pagination and search
   */
  async getStudents(
    page: number,
    pageSize: number,
    search?: string,
    classId?: string,
    section?: string,
    className?: string,
    status?: string
  ): Promise<StudentListResponse> {
    const skip = (page - 1) * pageSize;

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { rollNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (classId) {
      whereCondition.classId = classId;
    }

    if (className) {
      whereCondition.class = {
        name: { contains: className, mode: "insensitive" },
      };
    }

    if (section) {
      whereCondition.section = { contains: section, mode: "insensitive" };
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

    const [students, total] = await Promise.all([
      db.student.findMany({
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
          class: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
          parents: {
            include: {
              parent: {
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
          },
          attendances: {
            select: {
              id: true,
            },
          },
          examResults: {
            select: {
              id: true,
              marksObtained: true,
            },
          },
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      }),
      db.student.count({ where: whereCondition }),
    ]);

    const data = students.map((student) => this.mapStudentToResponse(student));

    return {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data,
    };
  }

  /**
   * Get students by class
   */
  async getStudentsByClass(classId: string, page: number, pageSize: number): Promise<StudentClassListResponse> {
    const skip = (page - 1) * pageSize;

    const classData = await db.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        name: true,
        section: true,
      },
    });

    if (!classData) {
      throw new NotFoundError("Class not found");
    }

    const [students, total] = await Promise.all([
      db.student.findMany({
        where: { classId },
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
          class: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
          parents: {
            include: {
              parent: {
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
          },
          attendances: true,
        },
        orderBy: {
          rollNumber: "asc",
        },
      }),
      db.student.count({ where: { classId } }),
    ]);

    const studentResponses = students.map((student) => this.mapStudentToResponse(student));

    // Calculate average attendance
    const averageAttendance =
      students.length > 0
        ? students.reduce((sum, s) => sum + (s.attendances?.length || 0), 0) / students.length
        : 0;

    return {
      classId: classData.id,
      className: classData.name,
      section: classData.section,
      totalStudents: total,
      averageAttendance: Math.round(averageAttendance),
      students: studentResponses,
    };
  }

  /**
   * Get single student by ID
   */
  async getStudentById(id: string): Promise<StudentWithStats> {
    const student = await db.student.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: {
              select: {
                dateOfBirth: true,
                gender: true,
                address: true,
              },
            },
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
        parents: {
          include: {
            parent: {
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
        },
        attendances: {
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
        examResults: {
          select: {
            id: true,
            marksObtained: true,
            grade: true,
          },
        },
        feePayments: {
          select: {
            id: true,
            amountPaid: true,
            status: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    const response = this.mapStudentToResponse(student);

    // Calculate stats
    const attendancePercentage = student.attendances.length > 0 ? 85 : 0; // Example logic
    const averageGrade = student.examResults.length > 0 ? "A" : "N/A"; // Example logic

    return {
      ...response,
      stats: {
        attendance: attendancePercentage,
        grade: averageGrade,
      },
    };
  }

  /**
   * Create new student
   */
  async createStudent(input: CreateStudentInput): Promise<StudentResponse> {
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

    if (!input.classId || !input.classId.trim()) {
      throw new BadRequestError("Class ID is required");
    }

    if (!input.section || !input.section.trim()) {
      throw new BadRequestError("Section is required");
    }

    if (!input.rollNumber || !input.rollNumber.trim()) {
      throw new BadRequestError("Roll number is required");
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    // Verify class exists
    const classExists = await db.class.findUnique({
      where: { id: input.classId },
    });

    if (!classExists) {
      throw new NotFoundError("Class not found");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user and student in transaction
    const user = await db.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: hashedPassword,
        phone: input.phone?.trim(),
        role: "STUDENT",
        status: "active",
        profile: {
          create: {
            dateOfBirth: input.dateOfBirth,
            gender: input.gender,
            address: input.address?.trim(),
          },
        },
        student: {
          create: {
            classId: input.classId,
            section: input.section.trim(),
            rollNumber: input.rollNumber.trim(),
            admissionDate: new Date(),
          },
        },
      },
      include: {
        student: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                section: true,
              },
            },
            parents: {
              include: {
                parent: {
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
            },
          },
        },
        profile: true,
      },
    });

    const student = user.student!;

    return {
      id: student.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      avatar: user.avatar || undefined,
      status: user.status,
      class: {
        id: student.class.id,
        name: student.class.name,
        section: student.class.section,
      },
      rollNumber: student.rollNumber,
      dateOfBirth: user.profile?.dateOfBirth || undefined,
      gender: user.profile?.gender || undefined,
      address: user.profile?.address || undefined,
      admissionDate: student.admissionDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update student information
   */
  async updateStudent(id: string, input: UpdateStudentInput): Promise<StudentResponse> {
    const student = await db.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // If classId is being updated, verify it exists
    if (input.classId) {
      const classExists = await db.class.findUnique({
        where: { id: input.classId },
      });

      if (!classExists) {
        throw new NotFoundError("Class not found");
      }
    }

    // Update user information
    const updatedUser = await db.user.update({
      where: { id: student.userId },
      data: {
        name: input.name ? input.name.trim() : undefined,
        phone: input.phone ? input.phone.trim() : undefined,
        status: input.status,
      },
      include: {
        student: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                section: true,
              },
            },
            parents: {
              include: {
                parent: {
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
            },
          },
        },
      },
    });

    const updatedStudent = updatedUser.student!;

    // Update profile-specific fields
    if (input.dateOfBirth !== undefined || input.gender !== undefined || input.address !== undefined) {
      await db.profile.update({
        where: { userId: updatedUser.id },
        data: {
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          address: input.address ? input.address.trim() : undefined,
        },
      });
    }

    // Update student-specific fields
    if (input.classId || input.section || input.rollNumber) {
      await db.student.update({
        where: { id },
        data: {
          classId: input.classId,
          section: input.section ? input.section.trim() : undefined,
          rollNumber: input.rollNumber ? input.rollNumber.trim() : undefined,
        },
      });
    }

    // Fetch updated student with profile
    const finalStudent = await db.student.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
      },
    });

    if (!finalStudent) {
      throw new NotFoundError("Student not found");
    }

    return {
      id: finalStudent.id,
      userId: finalStudent.userId,
      name: finalStudent.user.name,
      email: finalStudent.user.email,
      phone: finalStudent.user.phone || undefined,
      avatar: finalStudent.user.avatar || undefined,
      status: finalStudent.user.status,
      class: {
        id: finalStudent.class.id,
        name: finalStudent.class.name,
        section: finalStudent.class.section,
      },
      rollNumber: finalStudent.rollNumber,
      dateOfBirth: finalStudent.user.profile?.dateOfBirth || undefined,
      gender: finalStudent.user.profile?.gender || undefined,
      address: finalStudent.user.profile?.address || undefined,
      admissionDate: finalStudent.admissionDate,
      createdAt: finalStudent.user.createdAt,
      updatedAt: finalStudent.user.updatedAt,
    };
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<void> {
    const student = await db.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Delete user which cascades to student
    await db.user.delete({
      where: { id: student.userId },
    });
  }

  /**
   * Get student statistics
   */
  async getStudentStats(id: string) {
    const student = await db.student.findUnique({
      where: { id },
      include: {
        attendances: {
          select: {
            status: true,
          },
        },
        examResults: {
          select: {
            marksObtained: true,
            remarks: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Calculate attendance percentage
    const presentDays = student.attendances.filter((a) => a.status === "PRESENT").length;
    const attendancePercentage = student.attendances.length > 0 ? (presentDays / student.attendances.length) * 100 : 0;

    // Calculate average grade
    let averageMarks = 0;
    if (student.examResults.length > 0) {
      const totalMarks = student.examResults.reduce((sum, r) => sum + r.marksObtained, 0);
      averageMarks = totalMarks / student.examResults.length;
    }

    return {
      attendance: Math.round(attendancePercentage),
      averageMarks: Math.round(averageMarks),
      totalExams: student.examResults.length,
      totalAttendanceDays: student.attendances.length,
    };
  }

  /**
   * Map student database record to response DTO
   */
  private mapStudentToResponse(student: any): StudentResponse {
    let parent = undefined;
    if (student.parents && student.parents.length > 0) {
      const firstParent = student.parents[0].parent;
      parent = {
        id: firstParent.id,
        name: firstParent.user.name,
        email: firstParent.user.email,
      };
    }

    return {
      id: student.id,
      userId: student.userId,
      name: student.user.name,
      email: student.user.email,
      phone: student.user.phone || undefined,
      avatar: student.user.avatar || undefined,
      status: student.user.status,
      class: {
        id: student.class.id,
        name: student.class.name,
        section: student.class.section,
      },
      rollNumber: student.rollNumber,
      dateOfBirth: student.user.profile?.dateOfBirth || undefined,
      gender: student.user.profile?.gender || undefined,
      address: student.user.profile?.address || undefined,
      parent,
      admissionDate: student.admissionDate,
      createdAt: student.user.createdAt,
      updatedAt: student.user.updatedAt,
    };
  }
}

export const studentService = new StudentService();
