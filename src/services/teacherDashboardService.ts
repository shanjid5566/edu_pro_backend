import { prisma } from "../lib/prisma.js";

class TeacherDashboardService {
  private async resolveTeacherId(userId: string): Promise<string> {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return teacher.id;
  }

  // Get dashboard overview statistics
  async getDashboardOverview(userId: string) {
    try {
      const teacherId = await this.resolveTeacherId(userId);

      // Get teacher info
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        select: {
          id: true,
          user: {
            select: { name: true, email: true, avatar: true },
          },
          classes: { select: { id: true } },
          classesTaken: true,
        },
      });

      if (!teacher) {
        throw new Error("Teacher not found");
      }

      const myClassesCount = teacher.classes.length;

      // Get total students count
      const totalStudents = await prisma.student.count({
        where: {
          class: {
            teachers: {
              some: { teacherId },
            },
          },
        },
      });

      // Get new students this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newStudentsThisWeek = await prisma.student.count({
        where: {
          class: {
            teachers: {
              some: { teacherId },
            },
          },
          user: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        },
      });

      // Get total classes taken
      const totalClassesTaken = teacher.classesTaken || 0;

      // Get average performance
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const examResults = await prisma.examResult.findMany({
        where: {
          exam: {
            class: {
              teachers: {
                some: { teacherId },
              },
            },
            date: {
              gte: oneMonthAgo,
            },
          },
        },
        select: {
          marksObtained: true,
        },
      });

      let averagePerformance = 0;
      if (examResults.length > 0) {
        const totalMarksObtained = examResults.reduce(
          (sum, result) => sum + result.marksObtained,
          0
        );
        averagePerformance = Math.round(totalMarksObtained / examResults.length) || 0;
      }

      // Get previous month average for comparison
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const previousMonthResults = await prisma.examResult.findMany({
        where: {
          exam: {
            class: {
              teachers: {
                some: { teacherId },
              },
            },
            date: {
              gte: twoMonthsAgo,
              lt: oneMonthAgo,
            },
          },
        },
        select: {
          marksObtained: true,
        },
      });

      let previousMonthAverage = 0;
      if (previousMonthResults.length > 0) {
        const totalMarksObtained = previousMonthResults.reduce(
          (sum, result) => sum + result.marksObtained,
          0
        );
        previousMonthAverage = Math.round(totalMarksObtained / previousMonthResults.length) || 0;
      }

      const performanceChange = averagePerformance - previousMonthAverage;

      return {
        success: true,
        data: {
          greeting: `Welcome back, ${teacher.user.name}! Here's your overview.`,
          statistics: {
            myClasses: {
              count: myClassesCount,
              label: "My Classes",
              today: 2, // This would be calculated from schedules
            },
            totalStudents: {
              count: totalStudents,
              label: "Total Students",
              change: `+${newStudentsThisWeek} this week`,
            },
            classesTaken: {
              count: totalClassesTaken,
              label: "Classes Taken",
            },
            avgPerformance: {
              percentage: averagePerformance,
              label: "Avg Performance",
              change: `${performanceChange >= 0 ? "+" : ""}${performanceChange}% vs last month`,
            },
          },
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      throw error;
    }
  }

  // Get class attendance trend
  async getAttendanceTrend(userId: string, months: number = 6) {
    try {
      const teacherId = await this.resolveTeacherId(userId);
      const attendanceData = [];
      const monthNames = [
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
      ];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth();

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const totalAttendances = await prisma.attendance.count({
          where: {
            class: {
              teachers: {
                some: { teacherId },
              },
            },
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const presentCount = await prisma.attendance.count({
          where: {
            class: {
              teachers: {
                some: { teacherId },
              },
            },
            status: "PRESENT",
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const attendancePercentage =
          totalAttendances > 0
            ? Math.round((presentCount / totalAttendances) * 100)
            : 0;

        attendanceData.push({
          month: monthNames[month],
          attendance: attendancePercentage,
        });
      }

      return {
        success: true,
        data: attendanceData,
      };
    } catch (error) {
      console.error("Error fetching attendance trend:", error);
      throw error;
    }
  }

  // Get student performance by subject
  async getStudentPerformanceBySubject(userId: string) {
    try {
      const teacherId = await this.resolveTeacherId(userId);
      const subjects = await prisma.subject.findMany({
        where: {
          teachers: {
            some: { teacherId },
          },
        },
        select: {
          id: true,
          name: true,
          exams: {
            where: {
              class: {
                teachers: {
                  some: { teacherId },
                },
              },
            },
            select: {
              totalMarks: true,
              results: {
                select: {
                  marksObtained: true,
                },
              },
            },
          },
        },
      });

      const performanceData = subjects.map((subject) => {
        let totalMarksObtained = 0;
        let totalMarksCount = 0;
        let resultCount = 0;

        subject.exams.forEach((exam) => {
          exam.results.forEach((result) => {
            totalMarksObtained += result.marksObtained;
            totalMarksCount += exam.totalMarks;
            resultCount++;
          });
        });

        const avgPercentage =
          totalMarksCount > 0
            ? Math.round((totalMarksObtained / totalMarksCount) * 100)
            : 0;

        return {
          subject: subject.name,
          percentage: avgPercentage,
        };
      });

      return {
        success: true,
        data: performanceData,
      };
    } catch (error) {
      console.error("Error fetching student performance:", error);
      throw error;
    }
  }

  // Get my classes (today and all)
  async getMyClasses(userId: string) {
    try {
      const teacherId = await this.resolveTeacherId(userId);
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

  // Get teacher profile
  async getTeacherProfile(userId: string) {
    try {
      const teacherId = await this.resolveTeacherId(userId);
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        select: {
          id: true,
          department: true,
          joinDate: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              role: true,
              createdAt: true,
            },
          },
          subjects: {
            select: {
              subject: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!teacher) {
        throw new Error("Teacher not found");
      }

      return {
        success: true,
        data: {
          id: teacher.id,
          name: teacher.user.name,
          email: teacher.user.email,
          phone: teacher.user.phone,
          avatar: teacher.user.avatar,
          role: teacher.user.role,
          department: teacher.department,
          joinDate: teacher.joinDate,
          subjects: teacher.subjects.map((ts) => ({
            id: ts.subject.id,
            name: ts.subject.name,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      throw error;
    }
  }
}

export default new TeacherDashboardService();
