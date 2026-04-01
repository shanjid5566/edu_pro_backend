import { prisma } from "../lib/prisma.js";
import { calculateGrade } from "../utils/gradeUtils.js";

class StudentExamService {
  // Get all exams for student
  async getMyExams(studentId: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const exams = await prisma.exam.findMany({
        where: { classId: student.classId },
        select: {
          id: true,
          name: true,
          date: true,
          duration: true,
          totalMarks: true,
          type: true,
          status: true,
          subject: {
            select: { id: true, name: true },
          },
          class: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
          results: {
            where: { studentId },
            select: {
              marksObtained: true,
              totalMarks: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });

      // Group exams by status
      const upcoming = exams.filter((e) => e.status === "UPCOMING");
      const ongoing = exams.filter((e) => e.status === "ONGOING");
      const completed = exams.filter((e) => e.status === "COMPLETED");

      const formatExam = (exam: any) => ({
        id: exam.id,
        name: exam.name,
        subject: exam.subject.name,
        subjectId: exam.subject.id,
        class: `${exam.class.name}-${exam.class.section}`,
        date: exam.date.toISOString().split("T")[0],
        time: exam.duration,
        totalMarks: exam.totalMarks,
        type: exam.type,
        status: exam.status,
        marksObtained:
          exam.results.length > 0 ? exam.results[0].marksObtained : null,
        percentage:
          exam.results.length > 0 && exam.results[0].marksObtained !== null
            ? Math.round(
                (exam.results[0].marksObtained / exam.totalMarks) * 100
              )
            : null,
      });

      return {
        success: true,
        data: {
          upcoming: upcoming.map(formatExam),
          ongoing: ongoing.map(formatExam),
          completed: completed.map(formatExam),
          summary: {
            total: exams.length,
            upcomingCount: upcoming.length,
            ongoingCount: ongoing.length,
            completedCount: completed.length,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching my exams:", error);
      throw error;
    }
  }

  // Get upcoming exams
  async getUpcomingExams(studentId: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const exams = await prisma.exam.findMany({
        where: {
          classId: student.classId,
          status: "UPCOMING",
        },
        select: {
          id: true,
          name: true,
          date: true,
          duration: true,
          totalMarks: true,
          type: true,
          subject: {
            select: { id: true, name: true },
          },
        },
        orderBy: { date: "asc" },
      });

      return {
        success: true,
        data: exams.map((exam) => ({
          id: exam.id,
          name: exam.name,
          subject: exam.subject.name,
          date: exam.date.toISOString().split("T")[0],
          time: exam.duration,
          totalMarks: exam.totalMarks,
          type: exam.type,
        })),
      };
    } catch (error) {
      console.error("Error fetching upcoming exams:", error);
      throw error;
    }
  }

  // Get exam details
  async getExamDetails(studentId: string, examId: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const exam = await prisma.exam.findFirst({
        where: {
          id: examId,
          classId: student.classId,
        },
        select: {
          id: true,
          name: true,
          date: true,
          duration: true,
          totalMarks: true,
          type: true,
          status: true,
          subject: {
            select: { id: true, name: true },
          },
          class: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
          results: {
            where: { studentId },
            select: {
              id: true,
              marksObtained: true,
              totalMarks: true,
            },
          },
        },
      });

      if (!exam) {
        throw new Error("Exam not found");
      }

      return {
        success: true,
        data: {
          id: exam.id,
          name: exam.name,
          subject: exam.subject.name,
          subjectId: exam.subject.id,
          class: `${exam.class.name}-${exam.class.section}`,
          date: exam.date.toISOString().split("T")[0],
          time: exam.duration,
          totalMarks: exam.totalMarks,
          type: exam.type,
          status: exam.status,
          result:
            exam.results.length > 0
              ? {
                  marksObtained: exam.results[0].marksObtained,
                  totalMarks: exam.results[0].totalMarks,
                  percentage:
                    exam.results[0].marksObtained !== null
                      ? Math.round(
                          (exam.results[0].marksObtained /
                            exam.results[0].totalMarks) *
                            100
                        )
                      : null,
                  grade: calculateGrade(
                    exam.results[0].marksObtained !== null
                      ? Math.round(
                          (exam.results[0].marksObtained /
                            exam.results[0].totalMarks) *
                            100
                        )
                      : 0
                  ),
                }
              : null,
        },
      };
    } catch (error) {
      console.error("Error fetching exam details:", error);
      throw error;
    }
  }

  // Get exams by status
  async getExamsByStatus(studentId: string, status: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const validStatus = ["UPCOMING", "ONGOING", "COMPLETED"];
      if (!validStatus.includes(status.toUpperCase())) {
        throw new Error(
          "Invalid status. Must be UPCOMING, ONGOING, or COMPLETED"
        );
      }

      const exams = await prisma.exam.findMany({
        where: {
          classId: student.classId,
          status: status.toUpperCase() as "UPCOMING" | "ONGOING" | "COMPLETED",
        },
        select: {
          id: true,
          name: true,
          date: true,
          duration: true,
          totalMarks: true,
          type: true,
          subject: {
            select: { id: true, name: true },
          },
          results: {
            where: { studentId },
            select: {
              marksObtained: true,
              totalMarks: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });

      return {
        success: true,
        data: exams.map((exam) => ({
          id: exam.id,
          name: exam.name,
          subject: exam.subject.name,
          date: exam.date.toISOString().split("T")[0],
          time: exam.duration,
          totalMarks: exam.totalMarks,
          type: exam.type,
          status: status.toUpperCase(),
          marksObtained:
            exam.results.length > 0 ? exam.results[0].marksObtained : null,
          percentage:
            exam.results.length > 0 && exam.results[0].marksObtained !== null
              ? Math.round(
                  (exam.results[0].marksObtained / exam.totalMarks) * 100
                )
              : null,
        })),
      };
    } catch (error) {
      console.error("Error fetching exams by status:", error);
      throw error;
    }
  }

  // Get exam results
  async getExamResults(studentId: string) {
    try {
      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          id: true,
          marksObtained: true,
          totalMarks: true,
          exam: {
            select: {
              id: true,
              name: true,
              date: true,
              type: true,
              subject: { select: { name: true } },
              class: { select: { name: true, section: true } },
            },
          },
        },
        orderBy: { exam: { date: "desc" } },
      });

      return {
        success: true,
        data: results.map((result) => ({
          id: result.id,
          examId: result.exam.id,
          examName: result.exam.name,
          subject: result.exam.subject.name,
          class: `${result.exam.class.name}-${result.exam.class.section}`,
          date: result.exam.date.toISOString().split("T")[0],
          type: result.exam.type,
          marksObtained: result.marksObtained,
          totalMarks: result.totalMarks,
          percentage:
            result.marksObtained !== null
              ? Math.round((result.marksObtained / result.totalMarks) * 100)
              : 0,
          grade: calculateGrade(
            result.marksObtained !== null
              ? Math.round((result.marksObtained / result.totalMarks) * 100)
              : 0
          ),
        })),
      };
    } catch (error) {
      console.error("Error fetching exam results:", error);
      throw error;
    }
  }

  // Get exam statistics
  async getExamStatistics(studentId: string) {
    try {
      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          marksObtained: true,
          totalMarks: true,
        },
      });

      if (results.length === 0) {
        return {
          success: true,
          data: {
            totalExams: 0,
            averagePercentage: 0,
            highestPercentage: 0,
            lowestPercentage: 0,
          },
        };
      }

      let totalMarksObtained = 0;
      let totalMarksCount = 0;
      let highestPercentage = 0;
      let lowestPercentage = 100;

      results.forEach((result) => {
        if (result.marksObtained !== null) {
          totalMarksObtained += result.marksObtained;
          totalMarksCount += result.totalMarks;

          const percentage = Math.round(
            (result.marksObtained / result.totalMarks) * 100
          );
          if (percentage > highestPercentage) {
            highestPercentage = percentage;
          }
          if (percentage < lowestPercentage) {
            lowestPercentage = percentage;
          }
        }
      });

      const averagePercentage =
        totalMarksCount > 0
          ? Math.round((totalMarksObtained / totalMarksCount) * 100)
          : 0;

      return {
        success: true,
        data: {
          totalExams: results.filter((r) => r.marksObtained !== null).length,
          averagePercentage,
          highestPercentage: highestPercentage === 0 ? 0 : highestPercentage,
          lowestPercentage: lowestPercentage === 100 ? 0 : lowestPercentage,
        },
      };
    } catch (error) {
      console.error("Error fetching exam statistics:", error);
      throw error;
    }
  }

}

export default new StudentExamService();
