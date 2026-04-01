import { prisma } from "../lib/prisma.js";
import { AttendanceStatus } from "../../prisma/generated/prisma/client";

class TeacherAttendanceService {
  // Get students in a class for attendance marking
  async getClassStudentsForAttendance(teacherId: string, classId: string) {
    try {
      // Verify teacher is assigned to this class
      const teacherAssigned = await prisma.teacherClass.findFirst({
        where: { teacherId, classId },
      });

      if (!teacherAssigned) {
        throw new Error("Unauthorized - Teacher not assigned to this class");
      }

      // Get class and students
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          name: true,
          section: true,
          students: {
            select: {
              id: true,
              rollNumber: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: { rollNumber: "asc" },
          },
        },
      });

      if (!classData) {
        throw new Error("Class not found");
      }

      return {
        success: true,
        data: {
          class: {
            id: classData.id,
            name: classData.name,
            section: classData.section,
          },
          students: classData.students.map((student) => ({
            studentId: student.id,
            name: student.user.name,
            rollNumber: student.rollNumber,
            email: student.user.email,
          })),
          totalStudents: classData.students.length,
        },
      };
    } catch (error) {
      console.error("Error fetching class students:", error);
      throw error;
    }
  }

  // Mark attendance for a class
  async markAttendance(
    teacherId: string,
    classId: string,
    attendanceData: Array<{
      studentId: string;
      status: AttendanceStatus;
    }>,
    date: Date
  ) {
    try {
      // Verify teacher is assigned to this class
      const teacherAssigned = await prisma.teacherClass.findFirst({
        where: { teacherId, classId },
      });

      if (!teacherAssigned) {
        throw new Error("Unauthorized - Teacher not assigned to this class");
      }

      // Verify all students belong to the class
      const studentCount = await prisma.student.count({
        where: {
          id: { in: attendanceData.map((a) => a.studentId) },
          classId,
        },
      });

      if (studentCount !== attendanceData.length) {
        throw new Error("Some students do not belong to this class");
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Delete existing attendance for this class on this date (if any)
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
          markedBy: teacherId,
          date: new Date(date),
        })),
      });

      return {
        success: true,
        message: "Attendance marked successfully",
        data: {
          count: attendance.count,
          date: date.toISOString().split("T")[0],
        },
      };
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  }

  // Get attendance records for a class
  async getClassAttendanceRecords(
    teacherId: string,
    classId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      // Verify teacher is assigned to this class
      const teacherAssigned = await prisma.teacherClass.findFirst({
        where: { teacherId, classId },
      });

      if (!teacherAssigned) {
        throw new Error("Unauthorized - Teacher not assigned to this class");
      }

      const whereCondition: any = { classId };

      if (startDate || endDate) {
        whereCondition.date = {};
        if (startDate) {
          startDate.setHours(0, 0, 0, 0);
          whereCondition.date.gte = startDate;
        }
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
          whereCondition.date.lte = endDate;
        }
      }

      const attendanceRecords = await prisma.attendance.findMany({
        where: whereCondition,
        select: {
          id: true,
          date: true,
          status: true,
          student: {
            select: {
              rollNumber: true,
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { date: "desc" },
      });

      // Group by date
      const groupedByDate: { [key: string]: any[] } = {};
      attendanceRecords.forEach((record) => {
        const dateKey = record.date.toISOString().split("T")[0];
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        groupedByDate[dateKey].push({
          studentId: record.student.user.name,
          name: record.student.user.name,
          rollNumber: record.student.rollNumber,
          status: record.status,
        });
      });

      return {
        success: true,
        data: Object.keys(groupedByDate)
          .sort()
          .reverse()
          .map((date) => ({
            date,
            records: groupedByDate[date],
            total: groupedByDate[date].length,
            present: groupedByDate[date].filter((r) => r.status === "PRESENT")
              .length,
            absent: groupedByDate[date].filter((r) => r.status === "ABSENT")
              .length,
            late: groupedByDate[date].filter((r) => r.status === "LATE")
              .length,
          })),
      };
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      throw error;
    }
  }

  // Get attendance summary for a student
  async getStudentAttendanceSummary(
    teacherId: string,
    classId: string,
    studentId: string
  ) {
    try {
      // Verify teacher is assigned to this class
      const teacherAssigned = await prisma.teacherClass.findFirst({
        where: { teacherId, classId },
      });

      if (!teacherAssigned) {
        throw new Error("Unauthorized - Teacher not assigned to this class");
      }

      // Verify student is in the class
      const student = await prisma.student.findFirst({
        where: { id: studentId, classId },
      });

      if (!student) {
        throw new Error("Student not found in this class");
      }

      const attendanceRecords = await prisma.attendance.findMany({
        where: { studentId, classId },
        select: { status: true, date: true },
      });

      const totalRecords = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (r) => r.status === "PRESENT"
      ).length;
      const absentCount = attendanceRecords.filter(
        (r) => r.status === "ABSENT"
      ).length;
      const lateCount = attendanceRecords.filter(
        (r) => r.status === "LATE"
      ).length;

      const attendancePercentage =
        totalRecords > 0
          ? Math.round(((presentCount + lateCount * 0.5) / totalRecords) * 100)
          : 0;

      return {
        success: true,
        data: {
          studentId,
          totalClasses: totalRecords,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          attendancePercentage,
        },
      };
    } catch (error) {
      console.error("Error fetching student attendance summary:", error);
      throw error;
    }
  }
}

export default new TeacherAttendanceService();
