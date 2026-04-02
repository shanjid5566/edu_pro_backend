import { prisma } from "../lib/prisma.js";
import { calculateGrade } from "../utils/gradeUtils.js";

class StudentDashboardService {
  private async resolveStudentId(userId: string): Promise<string> {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student.id;
  }

  // Get dashboard overview
  async getDashboardOverview(userId: string) {
    try {
      const studentId = await this.resolveStudentId(userId);

      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          user: {
            select: { name: true, email: true, avatar: true },
          },
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              students: { select: { id: true } },
              subjects: { select: { id: true } },
            },
          },
          rollNumber: true,
        },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Count subjects
      const subjectsCount = student.class.subjects.length;

      // Get attendance percentage
      const totalAttendances = await prisma.attendance.count({
        where: { studentId },
      });

      const presentCount = await prisma.attendance.count({
        where: { studentId, status: "PRESENT" },
      });

      const attendancePercentage =
        totalAttendances > 0
          ? Math.round((presentCount / totalAttendances) * 100)
          : 0;

      // Get overall grade from exam results
      const examResults = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          marksObtained: true,
          exam: {
            select: {
              totalMarks: true,
            },
          },
        },
      });

      let overallPercentage = 0;
      if (examResults.length > 0) {
        const totalMarksObtained = examResults.reduce(
          (sum, result) => sum + (result.marksObtained || 0),
          0
        );
        const totalMarksCount = examResults.reduce(
          (sum, result) => sum + result.exam.totalMarks,
          0
        );
        overallPercentage =
          totalMarksCount > 0
            ? Math.round((totalMarksObtained / totalMarksCount) * 100)
            : 0;
      }

      // Calculate grade based on percentage
      const grade = calculateGrade(overallPercentage);

      // Get student rank in class
      const allStudentsInClass = await prisma.student.findMany({
        where: { classId: student.class.id },
        select: { id: true },
      });

      // Get all percentages to determine rank
      const studentPercentages = await Promise.all(
        allStudentsInClass.map(async (s) => {
          const results = await prisma.examResult.findMany({
            where: { studentId: s.id },
            select: {
              marksObtained: true,
              exam: {
                select: {
                  totalMarks: true,
                },
              },
            },
          });

          if (results.length === 0) return { studentId: s.id, percentage: 0 };

          const totalObtained = results.reduce(
            (sum, r) => sum + (r.marksObtained || 0),
            0
          );
          const totalMarks = results.reduce(
            (sum, r) => sum + r.exam.totalMarks,
            0
          );
          const percentage =
            totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100) : 0;

          return { studentId: s.id, percentage };
        })
      );

      const rankedStudents = studentPercentages
        .sort((a, b) => b.percentage - a.percentage)
        .map((s, idx) => ({ ...s, rank: idx + 1 }));

      const studentRank = rankedStudents.find(
        (s) => s.studentId === studentId
      )?.rank || allStudentsInClass.length;

      return {
        success: true,
        data: {
          greeting: `Welcome back, ${student.user.name}! Track your academic progress.`,
          statistics: {
            mySubjects: {
              count: subjectsCount,
              label: "My Subjects",
            },
            attendance: {
              percentage: attendancePercentage,
              label: "Attendance",
              status:
                attendancePercentage >= 75
                  ? "Above average"
                  : "Below average",
            },
            overallGrade: {
              grade,
              percentage: overallPercentage,
              label: "Overall Grade",
            },
            rank: {
              rank: studentRank,
              outOf: allStudentsInClass.length,
              label: "Rank",
              change:
                studentRank <= 5
                  ? "Up 2 positions"
                  : studentRank <= 10
                    ? "Stable"
                    : "Down",
            },
          },
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      throw error;
    }
  }

  // Get attendance trend
  async getAttendanceTrend(userId: string, months: number = 6) {
    try {
      const studentId = await this.resolveStudentId(userId);
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
            studentId,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const presentCount = await prisma.attendance.count({
          where: {
            studentId,
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

  // Get subject performance
  async getSubjectPerformance(userId: string) {
    try {
      const studentId = await this.resolveStudentId(userId);
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const classDetails = await prisma.class.findUnique({
        where: { id: student.classId },
        select: {
          subjects: {
            select: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  exams: {
                    where: {
                      classId: student.classId,
                    },
                    select: {
                      id: true,
                      totalMarks: true,
                      results: {
                        where: { studentId },
                        select: {
                          marksObtained: true,
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

      if (!classDetails) {
        return {
          success: true,
          data: [],
        };
      }

      const performanceData = (classDetails.subjects || []).map((classSubject) => {
        let totalMarksObtained = 0;
        let totalMarksCount = 0;

        ((classSubject.subject.exams || []) as any[]).forEach((exam) => {
          (exam.results || []).forEach((result) => {
            if (result.marksObtained !== null) {
              totalMarksObtained += result.marksObtained;
              totalMarksCount += exam.totalMarks;
            }
          });
        });

        const percentage =
          totalMarksCount > 0
            ? Math.round((totalMarksObtained / totalMarksCount) * 100)
            : 0;

        return {
          subject: classSubject.subject.name,
          percentage,
        };
      });

      return {
        success: true,
        data: performanceData,
      };
    } catch (error) {
      console.error("Error fetching subject performance:", error);
      throw error;
    }
  }

  // Get my classes
  async getMyClasses(userId: string) {
    try {
      const studentId = await this.resolveStudentId(userId);
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: {
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              students: { select: { id: true } },
              teachers: {
                select: {
                  teacher: {
                    select: { id: true, user: { select: { name: true } } },
                  },
                },
              },
              subjects: {
                select: {
                  subject: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      return {
        success: true,
        data: {
          classId: student.class.id,
          className: `${student.class.name}-${student.class.section}`,
          totalStudents: student.class.students.length,
          totalTeachers: student.class.teachers.length,
          totalSubjects: student.class.subjects.length,
          teachers: student.class.teachers.map((tc) => ({
            id: tc.teacher.id,
            name: tc.teacher.user.name,
          })),
          subjects: student.class.subjects.map((s) => ({
            id: s.subject.id,
            name: s.subject.name,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching my classes:", error);
      throw error;
    }
  }

  // Get recent exam results
  async getRecentResults(userId: string, limit: number = 5) {
    try {
      const studentId = await this.resolveStudentId(userId);
      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          id: true,
          marksObtained: true,
          exam: {
            select: {
              id: true,
              name: true,
              date: true,
              totalMarks: true,
              subject: { select: { name: true } },
              class: { select: { name: true, section: true } },
            },
          },
        },
        orderBy: { exam: { date: "desc" } },
        take: limit,
      });

      return {
        success: true,
        data: results.map((result) => ({
          examId: result.exam.id,
          examName: result.exam.name,
          subject: result.exam.subject.name,
          class: `${result.exam.class.name}-${result.exam.class.section}`,
          marksObtained: result.marksObtained,
          totalMarks: result.exam.totalMarks,
          percentage:
            result.marksObtained && result.exam.totalMarks
              ? Math.round(
                  (result.marksObtained / result.exam.totalMarks) * 100
                )
              : 0,
          date: result.exam.date.toISOString().split("T")[0],
        })),
      };
    } catch (error) {
      console.error("Error fetching recent results:", error);
      throw error;
    }
  }

}

export default new StudentDashboardService();
