import { prisma } from "../lib/prisma";

interface CreateSchedulePayload {
  classId: string;
  subjectId: string;
  day: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

interface UpdateSchedulePayload {
  subjectId?: string;
  day?: string;
  teacherId?: string;
  startTime?: string;
  endTime?: string;
  roomNumber?: string;
}

interface ScheduleListOptions {
  skip: number;
  take: number;
  search?: string;
  classId?: string;
  day?: string;
}

class AdminClassScheduleService {
  /**
   * Get all schedules with pagination, search and filters
   */
  async getAllSchedules(options: ScheduleListOptions) {
    try {
      const { skip, take, search, classId, day } = options;

      const where: any = {};

      if (classId) {
        where.classId = classId;
      }

      if (day) {
        where.day = day;
      }

      if (search) {
        where.OR = [
          { subject: { name: { contains: search, mode: "insensitive" } } },
          { roomNumber: { contains: search, mode: "insensitive" } },
          {
            teacher: {
              user: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        ];
      }

      const [schedules, total] = await Promise.all([
        prisma.classSchedule.findMany({
          where,
          include: {
            class: true,
            subject: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
          skip,
          take,
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        }),
        prisma.classSchedule.count({ where }),
      ]);

      const schedulesData = schedules.map((schedule) => ({
        id: schedule.id,
        classId: schedule.classId,
        className: schedule.class.name,
        classSection: schedule.class.section,
        day: schedule.day,
        subjectName: schedule.subject.name,
        teacherName: schedule.teacher.user.name,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        roomNumber: schedule.roomNumber,
      }));

      return {
        success: true,
        data: schedulesData,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch schedules");
    }
  }

  /**
   * Get schedule by ID
   */
  async getScheduleById(scheduleId: string) {
    try {
      const schedule = await prisma.classSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!schedule) {
        return {
          success: false,
          message: "Schedule not found",
        };
      }

      return {
        success: true,
        data: {
          id: schedule.id,
          classId: schedule.classId,
          className: schedule.class.name,
          classSection: schedule.class.section,
          day: schedule.day,
          subjectId: schedule.subjectId,
          subjectName: schedule.subject.name,
          teacherId: schedule.teacherId,
          teacherName: schedule.teacher.user.name,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          roomNumber: schedule.roomNumber,
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch schedule");
    }
  }

  /**
   * Create schedule
   */
  async createSchedule(payload: CreateSchedulePayload) {
    try {
      // Verify class exists
      const classExists = await prisma.class.findUnique({
        where: { id: payload.classId },
      });

      if (!classExists) {
        return {
          success: false,
          message: "Class not found",
        };
      }

      // Verify subject exists
      const subjectExists = await prisma.subject.findUnique({
        where: { id: payload.subjectId },
      });

      if (!subjectExists) {
        return {
          success: false,
          message: "Subject not found",
        };
      }

      // Verify teacher exists
      const teacherExists = await prisma.teacher.findUnique({
        where: { id: payload.teacherId },
      });

      if (!teacherExists) {
        return {
          success: false,
          message: "Teacher not found",
        };
      }

      // Enforce unique class/day/startTime with a clear API error message.
      const existingSlot = await prisma.classSchedule.findFirst({
        where: {
          classId: payload.classId,
          day: payload.day,
          startTime: payload.startTime,
        },
        include: {
          subject: {
            select: {
              name: true,
            },
          },
        },
      });

      if (existingSlot) {
        return {
          success: false,
          message: `Schedule already exists for ${payload.day} at ${payload.startTime} in this class (subject: ${existingSlot.subject.name})`,
        };
      }

      // Create schedule
      const newSchedule = await prisma.classSchedule.create({
        data: {
          classId: payload.classId,
          subjectId: payload.subjectId,
          day: payload.day,
          teacherId: payload.teacherId,
          startTime: payload.startTime,
          endTime: payload.endTime,
          roomNumber: payload.roomNumber,
        },
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });

      return {
        success: true,
        message: "Schedule created successfully",
        data: {
          id: newSchedule.id,
          classId: newSchedule.classId,
          className: newSchedule.class.name,
          classSection: newSchedule.class.section,
          day: newSchedule.day,
          subjectName: newSchedule.subject.name,
          teacherName: newSchedule.teacher.user.name,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime,
          roomNumber: newSchedule.roomNumber,
        },
      };
    } catch (error: any) {
      if (error?.code === "P2002") {
        return {
          success: false,
          message: "Schedule already exists for this class, day and start time",
        };
      }

      throw new Error(error?.message || "Failed to create schedule");
    }
  }

  /**
   * Update schedule
   */
  async updateSchedule(scheduleId: string, payload: UpdateSchedulePayload) {
    try {
      const schedule = await prisma.classSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return {
          success: false,
          message: "Schedule not found",
        };
      }

      // Verify subject exists if provided
      if (payload.subjectId) {
        const subjectExists = await prisma.subject.findUnique({
          where: { id: payload.subjectId },
        });

        if (!subjectExists) {
          return {
            success: false,
            message: "Subject not found",
          };
        }
      }

      // Verify teacher exists if provided
      if (payload.teacherId) {
        const teacherExists = await prisma.teacher.findUnique({
          where: { id: payload.teacherId },
        });

        if (!teacherExists) {
          return {
            success: false,
            message: "Teacher not found",
          };
        }
      }

      const updated = await prisma.classSchedule.update({
        where: { id: scheduleId },
        data: {
          ...(payload.day && { day: payload.day }),
          ...(payload.subjectId && { subjectId: payload.subjectId }),
          ...(payload.teacherId && { teacherId: payload.teacherId }),
          ...(payload.startTime && { startTime: payload.startTime }),
          ...(payload.endTime && { endTime: payload.endTime }),
          ...(payload.roomNumber && { roomNumber: payload.roomNumber }),
        },
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });

      return {
        success: true,
        message: "Schedule updated successfully",
        data: {
          id: updated.id,
          classId: updated.classId,
          className: updated.class.name,
          classSection: updated.class.section,
          day: updated.day,
          subjectName: updated.subject.name,
          teacherName: updated.teacher.user.name,
          startTime: updated.startTime,
          endTime: updated.endTime,
          roomNumber: updated.roomNumber,
        },
      };
    } catch (error: any) {
      throw new Error("Failed to update schedule");
    }
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(scheduleId: string) {
    try {
      const schedule = await prisma.classSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return {
          success: false,
          message: "Schedule not found",
        };
      }

      await prisma.classSchedule.delete({
        where: { id: scheduleId },
      });

      return {
        success: true,
        message: "Schedule deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete schedule");
    }
  }

  /**
   * Search schedules
   */
  async searchSchedules(query: string, limit: number = 10) {
    try {
      const schedules = await prisma.classSchedule.findMany({
        where: {
          OR: [
            { subject: { name: { contains: query, mode: "insensitive" } } },
            { roomNumber: { contains: query, mode: "insensitive" } },
            {
              teacher: {
                user: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
          ],
        },
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
        take: limit,
      });

      return {
        success: true,
        data: schedules.map((s) => ({
          id: s.id,
          className: `${s.class.name}-${s.class.section}`,
          day: s.day,
          subjectName: s.subject.name,
          teacherName: s.teacher.user.name,
          startTime: s.startTime,
          endTime: s.endTime,
          roomNumber: s.roomNumber,
        })),
      };
    } catch (error) {
      throw new Error("Failed to search schedules");
    }
  }

  /**
   * Get all schedules by class
   */
  async getSchedulesByClass(classId: string) {
    try {
      const schedules = await prisma.classSchedule.findMany({
        where: { classId },
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
      });

      return {
        success: true,
        data: schedules.map((s) => ({
          id: s.id,
          day: s.day,
          subjectName: s.subject.name,
          teacherName: s.teacher.user.name,
          startTime: s.startTime,
          endTime: s.endTime,
          roomNumber: s.roomNumber,
        })),
      };
    } catch (error) {
      throw new Error("Failed to fetch schedules by class");
    }
  }

  /**
   * Get all schedules by day
   */
  async getSchedulesByDay(day: string) {
    try {
      const schedules = await prisma.classSchedule.findMany({
        where: { day },
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
      });

      return {
        success: true,
        data: schedules.map((s) => ({
          id: s.id,
          className: `${s.class.name}-${s.class.section}`,
          subjectName: s.subject.name,
          teacherName: s.teacher.user.name,
          startTime: s.startTime,
          endTime: s.endTime,
          roomNumber: s.roomNumber,
        })),
      };
    } catch (error) {
      throw new Error("Failed to fetch schedules by day");
    }
  }

  /**
   * Export schedules to CSV
   */
  async exportSchedulesToCSV(options: ScheduleListOptions) {
    try {
      const { search, classId, day } = options;

      const where: any = {};

      if (classId) {
        where.classId = classId;
      }

      if (day) {
        where.day = day;
      }

      if (search) {
        where.OR = [
          { subject: { name: { contains: search, mode: "insensitive" } } },
          { roomNumber: { contains: search, mode: "insensitive" } },
          {
            teacher: {
              user: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        ];
      }

      const schedules = await prisma.classSchedule.findMany({
        where,
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
      });

      const csvData = schedules.map((s) => ({
        class: `${s.class.name}-${s.class.section}`,
        day: s.day,
        subject: s.subject.name,
        teacher: s.teacher.user.name,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.roomNumber,
      }));

      const headers = ["Class", "Day", "Subject", "Teacher", "Start Time", "End Time", "Room"];

      let csv = headers.join(",") + "\n";
      csvData.forEach((row) => {
        const values = [
          `"${row.class}"`,
          row.day,
          `"${row.subject}"`,
          `"${row.teacher}"`,
          row.startTime,
          row.endTime,
          row.room,
        ];
        csv += values.join(",") + "\n";
      });

      return {
        success: true,
        data: csv,
      };
    } catch (error) {
      throw new Error("Failed to export schedules to CSV");
    }
  }

  /**
   * Get all classes for dropdown
   */
  async getAllClasses() {
    try {
      const classes = await prisma.class.findMany({
        select: {
          id: true,
          name: true,
          section: true,
        },
        orderBy: [{ name: "asc" }, { section: "asc" }],
      });

      return {
        success: true,
        data: classes.map((c) => ({
          id: c.id,
          label: `${c.name}-${c.section}`,
        })),
      };
    } catch (error) {
      throw new Error("Failed to fetch classes");
    }
  }

  /**
   * Get all teachers for dropdown
   */
  async getAllTeachers() {
    try {
      const teachers = await prisma.teacher.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      });

      return {
        success: true,
        data: teachers.map((t) => ({
          id: t.id,
          name: t.user.name,
        })),
      };
    } catch (error) {
      throw new Error("Failed to fetch teachers");
    }
  }

  /**
   * Get all subjects for dropdown
   * If classId is provided, return only subjects assigned to that class.
   */
  async getAllSubjects(classId?: string) {
    try {
      if (classId) {
        const classSubjects = await prisma.classSubject.findMany({
          where: { classId },
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: {
            subject: {
              name: "asc",
            },
          },
        });

        return {
          success: true,
          data: classSubjects.map((cs) => ({
            id: cs.subject.id,
            name: cs.subject.name,
            code: cs.subject.code,
          })),
        };
      }

      const subjects = await prisma.subject.findMany({
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return {
        success: true,
        data: subjects,
      };
    } catch (error) {
      throw new Error("Failed to fetch subjects");
    }
  }
}

export default new AdminClassScheduleService();
