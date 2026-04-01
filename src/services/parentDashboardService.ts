import { prisma } from "../lib/prisma.js";

class ParentDashboardService {
  // Get all children
  async getMyChildren(parentId: string) {
    try {
      const parent = await prisma.parent.findUnique({
        where: { id: parentId },
        select: {
          enrollments: {
            select: {
              id: true,
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  class: {
                    select: {
                      name: true,
                      section: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!parent) {
        throw new Error("Parent not found");
      }

      return {
        success: true,
        data: parent.enrollments.map((enrollment) => ({
          enrollmentId: enrollment.id,
          studentId: enrollment.student.id,
          name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
          email: enrollment.student.email,
          class: `${enrollment.student.class.name}-${enrollment.student.class.section}`,
        })),
      };
    } catch (error) {
      console.error("Error fetching my children:", error);
      throw error;
    }
  }

  // Get child overview
  async getChildOverview(parentId: string, studentId: string) {
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
          class: {
            select: {
              name: true,
              section: true,
              totalStudents: true,
            },
          },
        },
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

      // Get overall grade
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

      const overallPercentage =
        totalMarksCount > 0 ? Math.round((totalMarks / totalMarksCount) * 100) : 0;

      // Get class ranking
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
        if (avg > overallPercentage) {
          rank++;
        }
      });

      // Get subject count
      const subjects = await prisma.subject.findMany({
        where: {
          class: { id: student?.class?.id },
        },
      });

      return {
        success: true,
        data: {
          studentName: `${student?.firstName} ${student?.lastName}`,
          class: `${student?.class?.name}-${student?.class?.section}`,
          attendance: {
            percentage: attendancePercentage,
            status:
              attendancePercentage >= 85
                ? "Excellent"
                : attendancePercentage >= 75
                ? "Good"
                : "Need Improvement",
          },
          overallGrade: this.calculateGrade(overallPercentage),
          subjects: subjects.length,
          classRank: rank,
          totalClassSize: student?.class?.totalStudents || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching child overview:", error);
      throw error;
    }
  }

  // Get child attendance trend
  async getAttendanceTrend(parentId: string, studentId: string, months: number = 6) {
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

      const attendance = await prisma.attendance.findMany({
        where: {
          studentId,
          date: { gte: startDate },
        },
        select: {
          date: true,
          status: true,
        },
        orderBy: { date: "asc" },
      });

      // Group by month
      const monthlyData: Record<string, { present: number; total: number }> = {};

      attendance.forEach((record) => {
        const monthKey = record.date.toISOString().substring(0, 7);

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { present: 0, total: 0 };
        }

        monthlyData[monthKey].total += 1;
        if (record.status === "PRESENT") {
          monthlyData[monthKey].present += 1;
        }
      });

      return {
        success: true,
        data: Object.entries(monthlyData)
          .sort()
          .map(([month, data]) => ({
            month,
            percentage:
              data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
            presentDays: data.present,
            totalDays: data.total,
          })),
      };
    } catch (error) {
      console.error("Error fetching attendance trend:", error);
      throw error;
    }
  }

  // Get child recent results
  async getRecentResults(parentId: string, studentId: string, limit: number = 5) {
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
              name: true,
              date: true,
              subject: { select: { name: true } },
            },
          },
        },
        orderBy: { exam: { date: "desc" } },
        take: limit,
      });

      return {
        success: true,
        data: results.map((result) => ({
          examName: result.exam.name,
          subject: result.exam.subject.name,
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
      console.error("Error fetching recent results:", error);
      throw error;
    }
  }

  // Get child subject performance
  async getSubjectPerformance(parentId: string, studentId: string) {
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
            },
          },
        },
      });

      const subjectMap: Record<
        string,
        { name: string; marks: number[]; totals: number[] }
      > = {};

      results.forEach((result) => {
        const subjectId = result.exam.subject.id;
        const subjectName = result.exam.subject.name;

        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = { name: subjectName, marks: [], totals: [] };
        }

        if (result.marksObtained !== null) {
          subjectMap[subjectId].marks.push(result.marksObtained);
          subjectMap[subjectId].totals.push(result.totalMarks);
        }
      });

      const subjectPerformance = Object.entries(subjectMap).map(([id, data]) => {
        const totalMarks = data.marks.reduce((a, b) => a + b, 0);
        const totalCount = data.totals.reduce((a, b) => a + b, 0);
        const percentage =
          totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;

        return {
          subjectId: id,
          subject: data.name,
          percentage,
          grade: this.calculateGrade(percentage),
          exams: data.marks.length,
        };
      });

      return {
        success: true,
        data: subjectPerformance.sort(
          (a, b) => b.percentage - a.percentage
        ),
      };
    } catch (error) {
      console.error("Error fetching subject performance:", error);
      throw error;
    }
  }

  // Get child upcoming events
  async getUpcomingEvents(parentId: string, studentId: string, limit: number = 5) {
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

      const today = new Date();

      // Get upcoming exams
      const exams = await prisma.exam.findMany({
        where: {
          class: { students: { some: { id: studentId } } },
          date: { gte: today },
        },
        select: {
          name: true,
          date: true,
          type: true,
          subject: { select: { name: true } },
        },
        orderBy: { date: "asc" },
        take: limit,
      });

      return {
        success: true,
        data: exams.map((exam) => ({
          type: "Exam",
          name: exam.name,
          subject: exam.subject.name,
          date: exam.date.toISOString().split("T")[0],
          daysAway: Math.ceil(
            (exam.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          ),
        })),
      };
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  }

  // Get notifications for child
  async getNotifications(parentId: string, studentId: string, limit: number = 5) {
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

      const notices = await prisma.notice.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          date: true,
          category: true,
        },
        orderBy: { date: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: notices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          message: notice.content.substring(0, 100) + "...",
          category: notice.category,
          date: notice.date.toISOString().split("T")[0],
          timeAgo: this.getTimeAgo(notice.date),
        })),
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
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

  // Helper function to get time ago
  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    return date.toISOString().split("T")[0];
  }
}

export default new ParentDashboardService();
