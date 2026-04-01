import { prisma } from "../lib/prisma.js";

class StudentResultsService {
  // Get all results
  async getAllResults(studentId: string) {
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
              status: true,
              subject: { select: { id: true, name: true } },
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
          subjectId: result.exam.subject.id,
          class: `${result.exam.class.name}-${result.exam.class.section}`,
          date: result.exam.date.toISOString().split("T")[0],
          type: result.exam.type,
          status: result.exam.status,
          marksObtained: result.marksObtained,
          totalMarks: result.totalMarks,
          percentage:
            result.marksObtained !== null
              ? Math.round((result.marksObtained / result.totalMarks) * 100)
              : 0,
          grade: this.calculateGrade(
            result.marksObtained !== null
              ? Math.round((result.marksObtained / result.totalMarks) * 100)
              : 0
          ),
        })),
      };
    } catch (error) {
      console.error("Error fetching all results:", error);
      throw error;
    }
  }

  // Get results by subject
  async getResultsBySubject(studentId: string, subjectId: string) {
    try {
      const results = await prisma.examResult.findMany({
        where: {
          studentId,
          exam: { subjectId },
        },
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
            },
          },
        },
        orderBy: { exam: { date: "desc" } },
      });

      if (results.length === 0) {
        throw new Error("No results found for this subject");
      }

      let totalMarksObtained = 0;
      let totalMarksCount = 0;

      results.forEach((result) => {
        if (result.marksObtained !== null) {
          totalMarksObtained += result.marksObtained;
          totalMarksCount += result.totalMarks;
        }
      });

      const averagePercentage =
        totalMarksCount > 0
          ? Math.round((totalMarksObtained / totalMarksCount) * 100)
          : 0;

      return {
        success: true,
        data: {
          subject: results[0].exam.subject.name,
          averagePercentage,
          totalExams: results.filter((r) => r.marksObtained !== null).length,
          averageGrade: this.calculateGrade(averagePercentage),
          results: results.map((result) => ({
            id: result.id,
            examId: result.exam.id,
            examName: result.exam.name,
            date: result.exam.date.toISOString().split("T")[0],
            type: result.exam.type,
            marksObtained: result.marksObtained,
            totalMarks: result.totalMarks,
            percentage:
              result.marksObtained !== null
                ? Math.round((result.marksObtained / result.totalMarks) * 100)
                : 0,
            grade: this.calculateGrade(
              result.marksObtained !== null
                ? Math.round((result.marksObtained / result.totalMarks) * 100)
                : 0
            ),
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching results by subject:", error);
      throw error;
    }
  }

  // Get subject performance overview
  async getSubjectPerformance(studentId: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          marksObtained: true,
          totalMarks: true,
          exam: {
            select: {
              subjectId: true,
              subject: { select: { id: true, name: true } },
            },
          },
        },
      });

      // Group by subject
      const subjectMap: Record<
        string,
        {
          name: string;
          marks: number[];
          totals: number[];
          exams: number;
        }
      > = {};

      results.forEach((result) => {
        const subjectId = result.exam.subjectId;
        const subjectName = result.exam.subject.name;

        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = {
            name: subjectName,
            marks: [],
            totals: [],
            exams: 0,
          };
        }

        if (result.marksObtained !== null) {
          subjectMap[subjectId].marks.push(result.marksObtained);
          subjectMap[subjectId].totals.push(result.totalMarks);
          subjectMap[subjectId].exams += 1;
        }
      });

      const subjectPerformance = Object.entries(subjectMap).map(
        ([id, data]) => {
          const totalMarksObtained = data.marks.reduce((a, b) => a + b, 0);
          const totalMarksCount = data.totals.reduce((a, b) => a + b, 0);
          const percentage =
            totalMarksCount > 0
              ? Math.round((totalMarksObtained / totalMarksCount) * 100)
              : 0;

          return {
            subjectId: id,
            subject: data.name,
            averagePercentage: percentage,
            grade: this.calculateGrade(percentage),
            totalExams: data.exams,
            marksObtained: totalMarksObtained,
            totalMarks: totalMarksCount,
          };
        }
      );

      return {
        success: true,
        data: subjectPerformance.sort(
          (a, b) => b.averagePercentage - a.averagePercentage
        ),
      };
    } catch (error) {
      console.error("Error fetching subject performance:", error);
      throw error;
    }
  }

  // Get comparison with class average
  async getClassComparison(studentId: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Get student's overall percentage
      const studentResults = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          marksObtained: true,
          totalMarks: true,
        },
      });

      let studentTotalMarks = 0;
      let studentTotalMarksCount = 0;

      studentResults.forEach((result) => {
        if (result.marksObtained !== null) {
          studentTotalMarks += result.marksObtained;
          studentTotalMarksCount += result.totalMarks;
        }
      });

      const studentPercentage =
        studentTotalMarksCount > 0
          ? Math.round((studentTotalMarks / studentTotalMarksCount) * 100)
          : 0;

      // Get class average
      const classResults = await prisma.examResult.findMany({
        where: {
          exam: { classId: student.classId },
        },
        select: {
          marksObtained: true,
          totalMarks: true,
          studentId: true,
        },
      });

      const studentAveragesMap: Record<string, { total: number; count: number }> = {};

      classResults.forEach((result) => {
        if (result.marksObtained !== null) {
          if (!studentAveragesMap[result.studentId]) {
            studentAveragesMap[result.studentId] = { total: 0, count: 0 };
          }
          studentAveragesMap[result.studentId].total += result.marksObtained;
          studentAveragesMap[result.studentId].count += result.totalMarks;
        }
      });

      let classTotal = 0;
      let classCount = 0;
      let studentsBetterThanMe = 0;
      let totalStudents = 0;

      Object.entries(studentAveragesMap).forEach(([id, data]) => {
        const percentage = Math.round((data.total / data.count) * 100);
        classTotal += percentage;
        totalStudents += 1;

        if (percentage > studentPercentage) {
          studentsBetterThanMe += 1;
        }
      });

      const classAverage =
        totalStudents > 0 ? Math.round(classTotal / totalStudents) : 0;
      const studentRank = studentsBetterThanMe + 1;

      return {
        success: true,
        data: {
          studentPercentage,
          classAverage,
          difference: studentPercentage - classAverage,
          studentRank,
          totalStudents,
          percentileRank:
            totalStudents > 0
              ? Math.round(
                  ((totalStudents - studentsBetterThanMe) / totalStudents) * 100
                )
              : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching class comparison:", error);
      throw error;
    }
  }

  // Get performance trend over time
  async getPerformanceTrend(studentId: string, months: number = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const results = await prisma.examResult.findMany({
        where: {
          studentId,
          exam: {
            date: {
              gte: startDate,
            },
          },
        },
        select: {
          marksObtained: true,
          totalMarks: true,
          exam: {
            select: {
              name: true,
              date: true,
            },
          },
        },
        orderBy: { exam: { date: "asc" } },
      });

      return {
        success: true,
        data: results.map((result) => ({
          examName: result.exam.name,
          date: result.exam.date.toISOString().split("T")[0],
          marksObtained: result.marksObtained,
          totalMarks: result.totalMarks,
          percentage:
            result.marksObtained !== null
              ? Math.round((result.marksObtained / result.totalMarks) * 100)
              : 0,
          grade: this.calculateGrade(
            result.marksObtained !== null
              ? Math.round((result.marksObtained / result.totalMarks) * 100)
              : 0
          ),
        })),
      };
    } catch (error) {
      console.error("Error fetching performance trend:", error);
      throw error;
    }
  }

  // Get results summary
  async getResultsSummary(studentId: string) {
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
            totalMarksObtained: 0,
            totalMarksCount: 0,
            averagePercentage: 0,
            averageGrade: "N/A",
            highestPercentage: 0,
            lowestPercentage: 0,
          },
        };
      }

      let totalMarksObtained = 0;
      let totalMarksCount = 0;
      let highestPercentage = 0;
      let lowestPercentage = 100;
      let totalExams = 0;

      results.forEach((result) => {
        if (result.marksObtained !== null) {
          totalMarksObtained += result.marksObtained;
          totalMarksCount += result.totalMarks;
          totalExams += 1;

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
          totalExams,
          totalMarksObtained,
          totalMarksCount,
          averagePercentage,
          averageGrade: this.calculateGrade(averagePercentage),
          highestPercentage: highestPercentage === 0 ? 0 : highestPercentage,
          lowestPercentage: lowestPercentage === 100 ? 0 : lowestPercentage,
        },
      };
    } catch (error) {
      console.error("Error fetching results summary:", error);
      throw error;
    }
  }

  // Helper function to calculate grade
  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  }
}

export default new StudentResultsService();
