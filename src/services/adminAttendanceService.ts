import { prisma } from "../lib/prisma.js";
import { AttendanceStatus } from "../../prisma/generated/prisma/client";

export class AdminAttendanceService {
  /**
   * Get attendance statistics for a specific date
   */
  static async getAttendanceStatistics(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const stats = await prisma.attendance.groupBy({
      by: ["status"],
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _count: true,
    });

    const total = stats.reduce((sum, stat) => sum + stat._count, 0);

    const result = {
      present: 0,
      absent: 0,
      late: 0,
      total,
      presentPercentage: 0,
      absentPercentage: 0,
      latePercentage: 0,
    };

    stats.forEach((stat) => {
      if (stat.status === "PRESENT") result.present = stat._count;
      if (stat.status === "ABSENT") result.absent = stat._count;
      if (stat.status === "LATE") result.late = stat._count;
    });

    if (total > 0) {
      result.presentPercentage = (result.present / total) * 100;
      result.absentPercentage = (result.absent / total) * 100;
      result.latePercentage = (result.late / total) * 100;
    }

    return result;
  }

  /**
   * Get class-wise attendance for a specific date - OPTIMIZED (single query)
   */
  static async getClasswiseAttendance(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Single aggregated query instead of N+1
    const classAttendance = await prisma.attendance.groupBy({
      by: ["classId", "status"],
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _count: true,
    });

    // Get class info and student counts in one query
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        section: true,
        _count: {
          select: { students: true },
        },
      },
    });

    // Process data in memory - much faster
    const classMap = new Map();
    classAttendance.forEach((record) => {
      if (!classMap.has(record.classId)) {
        classMap.set(record.classId, { present: 0, absent: 0, late: 0 });
      }
      const data = classMap.get(record.classId);
      if (record.status === "PRESENT") data.present = record._count;
      if (record.status === "ABSENT") data.absent = record._count;
      if (record.status === "LATE") data.late = record._count;
    });

    const classwise = classes.map((cls) => {
      const data = classMap.get(cls.id) || { present: 0, absent: 0, late: 0 };
      const total = cls._count.students;
      const rate =
        total > 0 ? Math.round(((data.present + data.late) / total) * 100) : 0;

      return {
        classId: cls.id,
        className: `${cls.name}-${cls.section}`,
        present: data.present,
        absent: data.absent,
        late: data.late,
        total,
        rate,
      };
    });

    return classwise;
  }

  /**
   * Get all attendance records with pagination
   */
  static async getAllAttendance(
    page: number = 1,
    limit: number = 10,
    classId?: string,
    status?: AttendanceStatus
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (classId) where.classId = classId;
    if (status) where.status = status;

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        select: {
          id: true,
          date: true,
          status: true,
          student: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
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
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      data: attendance,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get attendance record by ID
   */
  static async getAttendanceById(id: string) {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
      select: {
        id: true,
        date: true,
        status: true,
        student: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
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
                name: true,
              },
            },
          },
        },
      },
    });

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    return attendance;
  }

  /**
   * Mark attendance for students
   */
  static async markAttendance(
    classId: string,
    attendanceData: Array<{
      studentId: string;
      status: AttendanceStatus;
    }>,
    markedBy: string,
    date: Date
  ) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Delete existing attendance for this class on this date
    await prisma.attendance.deleteMany({
      where: {
        classId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Create new attendance records
    const attendance = await prisma.attendance.createMany({
      data: attendanceData.map((item) => ({
        ...item,
        classId,
        markedBy,
        date: new Date(date),
      })),
    });

    return {
      message: "Attendance marked successfully",
      count: attendance.count,
    };
  }

  /**
   * Update attendance record
   */
  static async updateAttendance(
    id: string,
    status: AttendanceStatus,
    markedBy: string
  ) {
    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        markedBy,
      },
      select: {
        id: true,
        date: true,
        status: true,
        student: {
          select: {
            id: true,
            user: {
              select: {
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
      },
    });

    return attendance;
  }

  /**
   * Delete attendance record
   */
  static async deleteAttendance(id: string) {
    await prisma.attendance.delete({
      where: { id },
    });

    return {
      message: "Attendance record deleted successfully",
    };
  }

  /**
   * Get attendance by date range
   */
  static async getAttendanceByDateRange(
    startDate: Date,
    endDate: Date,
    classId?: string
  ) {
    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (classId) where.classId = classId;

    const attendance = await prisma.attendance.findMany({
      where,
      select: {
        id: true,
        date: true,
        status: true,
        student: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
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
      },
      orderBy: {
        date: "desc",
      },
    });

    return attendance;
  }

  /**
   * Get student attendance history
   */
  static async getStudentAttendanceHistory(
    studentId: string,
    limit: number = 30
  ) {
    const attendance = await prisma.attendance.findMany({
      where: { studentId },
      select: {
        id: true,
        date: true,
        status: true,
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
      take: limit,
    });

    const stats = await prisma.attendance.groupBy({
      by: ["status"],
      where: { studentId },
      _count: true,
    });

    return {
      attendance,
      statistics: {
        present: stats.find((s) => s.status === "PRESENT")?._count || 0,
        absent: stats.find((s) => s.status === "ABSENT")?._count || 0,
        late: stats.find((s) => s.status === "LATE")?._count || 0,
        total:
          stats.reduce((sum, stat) => sum + stat._count, 0) ||
          0,
      },
    };
  }

  /**
   * Get attendance report by class
   */
  static async getAttendanceReportByClass(
    classId: string,
    startDate: Date,
    endDate: Date
  ) {
    const students = await prisma.student.findMany({
      where: { classId },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const report = await Promise.all(
      students.map(async (student) => {
        const attendance = await prisma.attendance.findMany({
          where: {
            studentId: student.id,
            classId,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            status: true,
            date: true,
          },
          orderBy: {
            date: "asc",
          },
        });

        const total = attendance.length;
        const present = attendance.filter(
          (a) => a.status === "PRESENT"
        ).length;
        const absent = attendance.filter(
          (a) => a.status === "ABSENT"
        ).length;
        const late = attendance.filter(
          (a) => a.status === "LATE"
        ).length;

        return {
          studentId: student.id,
          studentName: student.user.name,
          email: student.user.email,
          present,
          absent,
          late,
          total,
          percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
          records: attendance,
        };
      })
    );

    return report;
  }
}
