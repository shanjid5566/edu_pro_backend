import { prisma } from "../lib/prisma.js";

class TeacherClassService {
  // Get all assigned classes
  async getMyClasses(teacherId: string) {
    try {
      const today = new Date();
      const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

      // Get today's classes
      const todayClasses = await prisma.classSchedule.findMany({
        where: {
          teacherId,
          day: dayName,
        },
        select: {
          id: true,
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              students: { select: { id: true } },
            },
          },
          subject: {
            select: { name: true },
          },
          startTime: true,
          endTime: true,
          roomNumber: true,
        },
        take: 5,
      });

      // Get all classes for this teacher
      const allClasses = await prisma.teacherClass.findMany({
        where: { teacherId },
        select: {
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              students: { select: { id: true } },
            },
          },
        },
      });

      return {
        success: true,
        data: {
          today: todayClasses.map((cls) => ({
            classId: cls.class.id,
            className: `${cls.class.name}-${cls.class.section}`,
            subject: cls.subject.name,
            time: `${cls.startTime} - ${cls.endTime}`,
            room: cls.roomNumber,
            studentCount: cls.class.students.length,
          })),
          total: allClasses.length,
          allClasses: allClasses.map((tc) => ({
            classId: tc.class.id,
            className: `${tc.class.name}-${tc.class.section}`,
            studentCount: tc.class.students.length,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching my classes:", error);
      throw error;
    }
  }

  // Get class details by ID
  async getClassDetails(teacherId: string, classId: string) {
    try {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          name: true,
          section: true,
          capacity: true,
          students: {
            select: {
              id: true,
              user: { select: { name: true, email: true } },
            },
          },
          teachers: {
            select: {
              teacher: {
                select: { id: true, user: { select: { name: true } } },
              },
            },
          },
          schedules: {
            select: {
              id: true,
              day: true,
              startTime: true,
              endTime: true,
              subject: { select: { name: true } },
              roomNumber: true,
              teacher: { select: { id: true } },
            },
          },
        },
      });

      if (!classData) {
        throw new Error("Class not found");
      }

      // Verify that the teacher is assigned to this class
      const isTeacherAssigned = classData.teachers.some(
        (tc) => tc.teacher.id === teacherId
      );

      if (!isTeacherAssigned) {
        throw new Error("Unauthorized - Teacher not assigned to this class");
      }

      return {
        success: true,
        data: classData,
      };
    } catch (error) {
      console.error("Error fetching class details:", error);
      throw error;
    }
  }

  // Get today's class schedule
  async getTodayClassSchedule(teacherId: string) {
    try {
      const today = new Date();
      const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

      const schedule = await prisma.classSchedule.findMany({
        where: {
          teacherId,
          day: dayName,
        },
        select: {
          id: true,
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              students: { select: { id: true } },
            },
          },
          subject: {
            select: { id: true, name: true },
          },
          startTime: true,
          endTime: true,
          roomNumber: true,
        },
        orderBy: { startTime: "asc" },
      });

      return {
        success: true,
        data: schedule.map((cls) => ({
          scheduleId: cls.id,
          classId: cls.class.id,
          className: `${cls.class.name}-${cls.class.section}`,
          subject: cls.subject.name,
          time: `${cls.startTime} - ${cls.endTime}`,
          room: cls.roomNumber,
          studentCount: cls.class.students.length,
        })),
      };
    } catch (error) {
      console.error("Error fetching today's schedule:", error);
      throw error;
    }
  }

  // Get class statistics
  async getClassStatistics(teacherId: string, classId: string) {
    try {
      // Verify teacher assignment
      const teacherClass = await prisma.teacherClass.findFirst({
        where: { teacherId, classId },
      });

      if (!teacherClass) {
        throw new Error("Unauthorized - Teacher not assigned to this class");
      }

      // Get class data
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          name: true,
          section: true,
          students: { select: { id: true } },
        },
      });

      // Get attendance statistics
      const totalAttendances = await prisma.attendance.count({
        where: { classId },
      });

      const presentCount = await prisma.attendance.count({
        where: { classId, status: "PRESENT" },
      });

      const absentCount = await prisma.attendance.count({
        where: { classId, status: "ABSENT" },
      });

      const attendancePercentage =
        totalAttendances > 0
          ? Math.round((presentCount / totalAttendances) * 100)
          : 0;

      // Get average performance
      const examResults = await prisma.examResult.findMany({
        where: {
          exam: {
            classes: { some: { id: classId } },
          },
        },
        select: {
          marksObtained: true,
          totalMarks: true,
        },
      });

      let averagePercentage = 0;
      if (examResults.length > 0) {
        const totalMarksObtained = examResults.reduce(
          (sum, result) => sum + result.marksObtained,
          0
        );
        const totalMarksCount = examResults.reduce(
          (sum, result) => sum + result.totalMarks,
          0
        );
        averagePercentage =
          totalMarksCount > 0
            ? Math.round((totalMarksObtained / totalMarksCount) * 100)
            : 0;
      }

      return {
        success: true,
        data: {
          class: {
            id: classData!.id,
            name: classData!.name,
            section: classData!.section,
          },
          students: {
            total: classData!.students.length,
          },
          attendance: {
            percentage: attendancePercentage,
            present: presentCount,
            absent: absentCount,
            total: totalAttendances,
          },
          performance: {
            averagePercentage,
            examsCount: examResults.length,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching class statistics:", error);
      throw error;
    }
  }
}

export default new TeacherClassService();
