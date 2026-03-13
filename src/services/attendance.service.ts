import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import {
  MarkAttendanceInput,
  UpdateAttendanceInput,
  AttendanceResponse,
  AttendanceSummary,
  ClassWiseAttendance,
  DailyStatistics,
  AttendanceReport,
  AttendanceListResponse,
  BulkMarkAttendanceInput,
  BulkMarkAttendanceResponse,
} from "../types/attendance.dto.js";
import { teacherService } from "./teacher.service.js";

export class AttendanceService {
  /**
   * Mark attendance for a student
   */
  async markAttendance(
    input: MarkAttendanceInput,
    markedByUserId: string
  ): Promise<AttendanceResponse> {
    // Validate required fields
    if (!input.studentId || !input.studentId.trim()) {
      throw new BadRequestError("Student ID is required");
    }

    if (!input.classId || !input.classId.trim()) {
      throw new BadRequestError("Class ID is required");
    }

    if (!input.status) {
      throw new BadRequestError("Status is required");
    }

    if (!["PRESENT", "ABSENT", "LATE"].includes(input.status)) {
      throw new BadRequestError("Invalid status. Must be PRESENT, ABSENT, or LATE");
    }

    // Check if student exists
    const student = await db.student.findUnique({
      where: { id: input.studentId },
    });
    if (!student) {
      throw new NotFoundError(`Student with ID ${input.studentId} not found`);
    }

    // Check if class exists
    const classRecord = await db.class.findUnique({
      where: { id: input.classId },
    });
    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${input.classId} not found`);
    }

    // Normalize date (remove time)
    const attendanceDate = new Date(input.date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existingAttendance = await db.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: input.studentId,
          date: attendanceDate,
        },
      },
    });

    let attendance;
    if (existingAttendance) {
      // Update existing
      attendance = await db.attendance.update({
        where: {
          studentId_date: {
            studentId: input.studentId,
            date: attendanceDate,
          },
        },
        data: {
          status: input.status,
          markedBy: markedByUserId,
        },
        include: {
          student: {
            select: {
              id: true,
              user: {
                select: {
                  email: true,
                  name: true,
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
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Create new
      attendance = await db.attendance.create({
        data: {
          studentId: input.studentId,
          classId: input.classId,
          date: attendanceDate,
          status: input.status,
          markedBy: markedByUserId,
        },
        include: {
          student: {
            select: {
              id: true,
              user: {
                select: {
                  email: true,
                  name: true,
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
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    return attendance as any as AttendanceResponse;
  }

  /**
   * Get attendance by ID
   */
  async getAttendanceById(id: string): Promise<AttendanceResponse> {
    const attendance = await db.attendance.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
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
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundError(`Attendance with ID ${id} not found`);
    }

    return attendance as any as AttendanceResponse;
  }

  /**
   * Update attendance record
   */
  async updateAttendance(
    id: string,
    input: UpdateAttendanceInput
  ): Promise<AttendanceResponse> {
    // Check if attendance exists
    const existing = await db.attendance.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Attendance with ID ${id} not found`);
    }

    // Validate status if provided
    if (input.status && !["PRESENT", "ABSENT", "LATE"].includes(input.status)) {
      throw new BadRequestError("Invalid status. Must be PRESENT, ABSENT, or LATE");
    }

    // Prepare update data
    const updateData: any = {};
    if (input.status) {
      updateData.status = input.status;
    }
    if (input.date) {
      const newDate = new Date(input.date);
      newDate.setHours(0, 0, 0, 0);
      updateData.date = newDate;
    }

    const attendance = await db.attendance.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
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
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return attendance as any as AttendanceResponse;
  }

  /**
   * Delete attendance record
   */
  async deleteAttendance(id: string): Promise<void> {
    const attendance = await db.attendance.findUnique({ where: { id } });
    if (!attendance) {
      throw new NotFoundError(`Attendance with ID ${id} not found`);
    }

    await db.attendance.delete({ where: { id } });
  }

  /**
   * Get attendance records with pagination and filters
   */
  async getAttendanceRecords(
    page: number = 1,
    pageSize: number = 10,
    classId?: string,
    studentId?: string,
    startDate?: Date,
    endDate?: Date,
    status?: string
  ): Promise<AttendanceListResponse> {
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};
    if (classId) {
      where.classId = classId;
    }
    if (studentId) {
      where.studentId = studentId;
    }
    if (status) {
      where.status = status.toUpperCase();
    }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const total = await db.attendance.count({ where });

    const records = await db.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
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
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { date: "desc" },
    });

    return {
      records: records as AttendanceResponse[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get attendance summary for a specific date
   */
  async getDailySummary(date: Date): Promise<AttendanceSummary> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const attendances = await db.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const total = attendances.length;
    const present = attendances.filter((a: { status: string }) => a.status === "PRESENT").length;
    const absent = attendances.filter((a: { status: string }) => a.status === "ABSENT").length;
    const late = attendances.filter((a: { status: string }) => a.status === "LATE").length;

    return {
      date: startDate,
      total,
      present,
      absent,
      late,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((late / total) * 100) : 0,
    };
  }

  /**
   * Get class-wise attendance for a specific date
   */
  async getClassWiseAttendance(date: Date): Promise<ClassWiseAttendance[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const classes = await db.class.findMany();
    const result: ClassWiseAttendance[] = [];

    for (const classRecord of classes) {
      const attendances = await db.attendance.findMany({
        where: {
          classId: classRecord.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const total = attendances.length;
      const present = attendances.filter((a: { status: string }) => a.status === "PRESENT").length;
      const absent = attendances.filter((a: { status: string }) => a.status === "ABSENT").length;
      const late = attendances.filter((a: { status: string }) => a.status === "LATE").length;

      result.push({
        classId: classRecord.id,
        className: classRecord.name,
        present,
        absent,
        late,
        total,
        attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    }

    return result;
  }

  /**
   * Get daily statistics (summary + class-wise)
   */
  async getDailyStatistics(date: Date): Promise<DailyStatistics> {
    const summary = await this.getDailySummary(date);
    const classWise = await this.getClassWiseAttendance(date);

    return {
      date: new Date(date),
      summary,
      classWise,
    };
  }

  /**
   * Bulk mark attendance for a class
   */
  async bulkMarkAttendance(
    input: BulkMarkAttendanceInput,
    markedByUserId: string
  ): Promise<BulkMarkAttendanceResponse> {
    // Check if class exists
    const classRecord = await db.class.findUnique({
      where: { id: input.classId },
    });
    if (!classRecord) {
      throw new NotFoundError(`Class with ID ${input.classId} not found`);
    }

    const normalizedDate = new Date(input.date);
    normalizedDate.setHours(0, 0, 0, 0);

    let successful = 0;
    let failed = 0;
    const errors: any[] = [];

    // Process each student attendance
    for (const att of input.attendances) {
      try {
        // Check if student exists
        const student = await db.student.findUnique({
          where: { id: att.studentId },
        });
        if (!student) {
          failed++;
          errors.push({
            studentId: att.studentId,
            error: `Student not found`,
          });
          continue;
        }

        // Check if student belongs to this class
        if (student.classId !== input.classId) {
          failed++;
          errors.push({
            studentId: att.studentId,
            error: `Student not in this class`,
          });
          continue;
        }

        // Mark attendance
        await db.attendance.upsert({
          where: {
            studentId_date: {
              studentId: att.studentId,
              date: normalizedDate,
            },
          },
          create: {
            studentId: att.studentId,
            classId: input.classId,
            date: normalizedDate,
            status: att.status as any,
            markedBy: markedByUserId,
          },
          update: {
            status: att.status as any,
            markedBy: markedByUserId,
          },
        });

        successful++;
      } catch (error: any) {
        failed++;
        errors.push({
          studentId: att.studentId,
          error: error.message || "Failed to mark attendance",
        });
      }
    }

    return {
      classId: input.classId,
      date: normalizedDate,
      totalMarked: successful + failed,
      successful,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get attendance report for a student
   */
  async getStudentAttendanceReport(
    studentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceReport> {
    const records = await db.attendance.findMany({
      where: {
        studentId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
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
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      studentId,
      totalRecords: records.length,
      records: records as AttendanceResponse[],
    };
  }

  /**
   * Get student attendance percentage
   */
  async getStudentAttendancePercentage(
    studentId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    studentId: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendancePercentage: number;
  }> {
    const where: any = { studentId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const records = await db.attendance.findMany({ where });

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === "PRESENT").length;
    const absentDays = records.filter((r) => r.status === "ABSENT").length;
    const lateDays = records.filter((r) => r.status === "LATE").length;

    return {
      studentId,
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendancePercentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
    };
  }

  /**
   * Get attendance sheet for a teacher's assigned class and date
   */
  async getTeacherAttendanceSheet(userId: string, classId: string, date?: Date): Promise<any> {
    const teacher = await teacherService.getTeacherByUserId(userId);

    const isAssigned = teacher.classes.some((tc: { classId: string }) => tc.classId === classId);
    if (!isAssigned) {
      throw new BadRequestError("You are not assigned to this class");
    }

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    const classData = await db.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            rollNumber: "asc",
          },
        },
      },
    });

    if (!classData) {
      throw new NotFoundError("Class not found");
    }

    const attendance = await db.attendance.findMany({
      where: {
        classId,
        date: selectedDate,
      },
      select: {
        studentId: true,
        status: true,
      },
    });

    const statusMap = new Map(attendance.map((a: { studentId: string; status: string }) => [a.studentId, a.status]));

    const students = classData.students.map(
      (student: {
        id: string;
        rollNumber: string;
        user: { name: string };
      }) => ({
        studentId: student.id,
        name: student.user.name,
        rollNumber: student.rollNumber,
        status: statusMap.get(student.id) ?? null,
      })
    );

    const present = students.filter((s: { status: string | null }) => s.status === "PRESENT").length;
    const absent = students.filter((s: { status: string | null }) => s.status === "ABSENT").length;
    const late = students.filter((s: { status: string | null }) => s.status === "LATE").length;

    return {
      classId: classData.id,
      className: classData.name,
      section: classData.section,
      date: selectedDate,
      summary: {
        present,
        absent,
        late,
        total: students.length,
      },
      students,
    };
  }

  /**
   * Save attendance sheet for a teacher's assigned class/date
   */
  async saveTeacherAttendanceSheet(
    userId: string,
    classId: string,
    date: Date,
    attendances: Array<{ studentId: string; status: "PRESENT" | "ABSENT" | "LATE" }>
  ): Promise<any> {
    const teacher = await teacherService.getTeacherByUserId(userId);

    const isAssigned = teacher.classes.some((tc: { classId: string }) => tc.classId === classId);
    if (!isAssigned) {
      throw new BadRequestError("You are not assigned to this class");
    }

    await this.bulkMarkAttendance(
      {
        classId,
        date,
        attendances,
      },
      teacher.id
    );

    return this.getTeacherAttendanceSheet(userId, classId, date);
  }

  /**
   * Get teacher recent attendance summaries
   */
  async getTeacherRecentAttendance(userId: string, limit: number = 5): Promise<any> {
    const teacher = await teacherService.getTeacherByUserId(userId);

    const records = await db.attendance.findMany({
      where: {
        markedBy: teacher.id,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: Math.max(limit * 20, 20),
    });

    const grouped = new Map<
      string,
      {
        classId: string;
        className: string;
        section: string;
        date: Date;
        present: number;
        absent: number;
        late: number;
        total: number;
      }
    >();

    records.forEach((record: { class: { id: string; name: string; section: string }; date: Date; status: string }) => {
      const day = new Date(record.date);
      day.setHours(0, 0, 0, 0);
      const key = `${record.class.id}_${day.toISOString()}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          classId: record.class.id,
          className: record.class.name,
          section: record.class.section,
          date: day,
          present: 0,
          absent: 0,
          late: 0,
          total: 0,
        });
      }

      const bucket = grouped.get(key)!;
      bucket.total += 1;
      if (record.status === "PRESENT") bucket.present += 1;
      if (record.status === "ABSENT") bucket.absent += 1;
      if (record.status === "LATE") bucket.late += 1;
    });

    return Array.from(grouped.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
}

export const attendanceService = new AttendanceService();
