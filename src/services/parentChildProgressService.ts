import { prisma } from "../lib/prisma.js";
import { calculateGrade } from "../utils/gradeUtils.js";

class ParentChildProgressService {
  // Get overall progress metrics
  async getProgressMetrics(parentId: string, studentId: string) {
    try {
      // Verify parent-child relationship
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          student: { id: studentId },
          parents: { some: { id: parentId } },
        },
      });

      if (!enrollment) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          class: { select: { id: true, totalStudents: true } },
        },
      });

      // Get current grade
      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: { marksObtained: true, totalMarks: true },
      });

      let totalMarks = 0;
      let totalMarksCount = 0;

      results.forEach((result) => {
        if (result.marksObtained !== null) {
          totalMarks += result.marksObtained;
          totalMarksCount += result.totalMarks;
        }
      });

      const currentPercentage =
        totalMarksCount > 0 ? Math.round((totalMarks / totalMarksCount) * 100) : 0;

      // Get class rank
      const allResults = await prisma.examResult.findMany({
        where: { exam: { classId: student?.class?.id } },
        select: { studentId: true, marksObtained: true, totalMarks: true },
      });

      const studentAverages: Record<string, number> = {};
      allResults.forEach((result) => {
        if (result.marksObtained !== null) {
          if (!studentAverages[result.studentId]) {
            studentAverages[result.studentId] = 0;
          }
          studentAverages[result.studentId] +=
            (result.marksObtained / result.totalMarks) * 100;
        }
      });

      let rank = 1;
      Object.entries(studentAverages).forEach(([id, avg]) => {
        if (avg > currentPercentage) {
          rank++;
        }
      });

      // Get attendance
      const attendance = await prisma.attendance.findMany({
        where: { studentId },
        select: { status: true },
      });

      const presentDays = attendance.filter((a) => a.status === "PRESENT").length;
      const attendancePercentage =
        attendance.length > 0
          ? Math.round((presentDays / attendance.length) * 100)
          : 0;

      // Get average score
      const avgScore = currentPercentage;

      return {
        success: true,
        data: {
          studentName: `${student?.firstName} ${student?.lastName}`,
          currentGrade: calculateGrade(currentPercentage),
          classRank: {
            rank,
            totalStudents: student?.class?.totalStudents || 0,
          },
          attendance: attendancePercentage,
          avgScore,
        },
      };
    } catch (error) {
      console.error("Error fetching progress metrics:", error);
      throw error;
    }
  }

  // Get progress over time (grades/percentages by month)
  async getProgressOverTime(parentId: string, studentId: string, months: number = 6) {
    try {
      // Verify parent-child relationship
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          student: { id: studentId },
          parents: { some: { id: parentId } },
        },
      });

      if (!enrollment) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const results = await prisma.examResult.findMany({
        where: {
          studentId,
          exam: {
            date: { gte: startDate },
          },
        },
        select: {
          marksObtained: true,
          totalMarks: true,
          exam: {
            select: {
              date: true,
            },
          },
        },
        orderBy: { exam: { date: "asc" } },
      });

      // Group by month
      const monthlyData: Record<string, { marks: number[]; totals: number[] }> = {};

      results.forEach((result) => {
        const monthKey = result.exam.date.toISOString().substring(0, 7);

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { marks: [], totals: [] };
        }

        if (result.marksObtained !== null) {
          monthlyData[monthKey].marks.push(result.marksObtained);
          monthlyData[monthKey].totals.push(result.totalMarks);
        }
      });

      return {
        success: true,
        data: Object.entries(monthlyData)
          .sort()
          .map(([month, data]) => {
            const totalMarks = data.marks.reduce((a, b) => a + b, 0);
            const totalCount = data.totals.reduce((a, b) => a + b, 0);
            const percentage =
              totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;

            return {
              month,
              percentage,
              grade: calculateGrade(percentage),
            };
          }),
      };
    } catch (error) {
      console.error("Error fetching progress over time:", error);
      throw error;
    }
  }

  // Get subject-wise performance with comparison
  async getSubjectWisePerformance(parentId: string, studentId: string) {
    try {
      // Verify parent-child relationship
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          student: { id: studentId },
          parents: { some: { id: parentId } },
        },
      });

      if (!enrollment) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: {
          marksObtained: true,
          totalMarks: true,
          exam: {
            select: {
              subject: { select: { id: true, name: true } },
              classId: true,
            },
          },
        },
      });

      const subjectMap: Record<
        string,
        {
          name: string;
          marks: number[];
          totals: number[];
          classId: string;
        }
      > = {};

      results.forEach((result) => {
        const subjectId = result.exam.subject.id;
        const subjectName = result.exam.subject.name;

        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = {
            name: subjectName,
            marks: [],
            totals: [],
            classId: result.exam.classId,
          };
        }

        if (result.marksObtained !== null) {
          subjectMap[subjectId].marks.push(result.marksObtained);
          subjectMap[subjectId].totals.push(result.totalMarks);
        }
      });

      const subjectPerformance = Object.entries(subjectMap).map(
        ([id, data]) => {
          const totalMarks = data.marks.reduce((a, b) => a + b, 0);
          const totalCount = data.totals.reduce((a, b) => a + b, 0);
          const percentage =
            totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;

          return {
            subjectId: id,
            subject: data.name,
            percentage,
            grade: calculateGrade(percentage),
            exams: data.marks.length,
          };
        }
      );

      return {
        success: true,
        data: subjectPerformance.sort(
          (a, b) => b.percentage - a.percentage
        ),
      };
    } catch (error) {
      console.error("Error fetching subject-wise performance:", error);
      throw error;
    }
  }

  // Get exam results with trends
  async getExamResultsWithTrends(parentId: string, studentId: string, limit: number = 10) {
    try {
      // Verify parent-child relationship
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          student: { id: studentId },
          parents: { some: { id: parentId } },
        },
      });

      if (!enrollment) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

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
              subject: { select: { name: true } },
            },
          },
        },
        orderBy: { exam: { date: "desc" } },
        take: limit,
      });

      // Calculate trends (improvement/decline)
      const examResults = results.map((result, index) => {
        const percentage =
          result.marksObtained !== null
            ? Math.round((result.marksObtained / result.totalMarks) * 100)
            : 0;

        let trend = null;
        if (index < results.length - 1) {
          const previousPercentage =
            results[index + 1].marksObtained !== null
              ? Math.round(
                  (results[index + 1].marksObtained /
                    results[index + 1].totalMarks) *
                    100
                )
              : 0;

          if (percentage > previousPercentage) {
            trend = "up";
          } else if (percentage < previousPercentage) {
            trend = "down";
          } else {
            trend = "stable";
          }
        }

        return {
          id: result.id,
          subject: result.exam.subject.name,
          examName: result.exam.name,
          date: result.exam.date.toISOString().split("T")[0],
          marksObtained: result.marksObtained,
          totalMarks: result.totalMarks,
          percentage,
          grade: calculateGrade(percentage),
          trend,
        };
      });

      return {
        success: true,
        data: examResults,
      };
    } catch (error) {
      console.error("Error fetching exam results with trends:", error);
      throw error;
    }
  }

  // Get performance summary
  async getPerformanceSummary(parentId: string, studentId: string) {
    try {
      // Verify parent-child relationship
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          student: { id: studentId },
          parents: { some: { id: parentId } },
        },
      });

      if (!enrollment) {
        throw new Error("Unauthorized: Child not found for this parent");
      }

      const results = await prisma.examResult.findMany({
        where: { studentId },
        select: { marksObtained: true, totalMarks: true },
      });

      if (results.length === 0) {
        return {
          success: true,
          data: {
            totalExams: 0,
            averagePercentage: 0,
            highestPercentage: 0,
            lowestPercentage: 0,
            gradeDistribution: {},
          },
        };
      }

      let totalMarks = 0;
      let totalCount = 0;
      let highest = 0;
      let lowest = 100;
      const gradeCount: Record<string, number> = {
        "A+": 0,
        A: 0,
        "B+": 0,
        B: 0,
        C: 0,
        D: 0,
        F: 0,
      };

      results.forEach((result) => {
        if (result.marksObtained !== null) {
          const percentage = Math.round(
            (result.marksObtained / result.totalMarks) * 100
          );

          totalMarks += result.marksObtained;
          totalCount += result.totalMarks;

          if (percentage > highest) highest = percentage;
          if (percentage < lowest) lowest = percentage;

          const grade = calculateGrade(percentage);
          gradeCount[grade]++;
        }
      });

      const averagePercentage =
        totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;

      return {
        success: true,
        data: {
          totalExams: results.filter((r) => r.marksObtained !== null).length,
          averagePercentage,
          highestPercentage: highest === 0 ? 0 : highest,
          lowestPercentage: lowest === 100 ? 0 : lowest,
          gradeDistribution: gradeCount,
        },
      };
    } catch (error) {
      console.error("Error fetching performance summary:", error);
      throw error;
    }
  }

}

export default new ParentChildProgressService();
