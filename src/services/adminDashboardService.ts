import { prisma } from "../lib/prisma";

class AdminDashboardService {
  /**
   * Get overall statistics
   */
  async getOverallStats() {
    try {
      const [
        totalStudents,
        totalTeachers,
        totalClasses,
        totalParents,
        totalSubjects,
      ] = await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
        prisma.parent.count(),
        prisma.subject.count(),
      ]);

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalParents,
        totalSubjects,
      };
    } catch (error) {
      throw new Error("Failed to fetch overall statistics");
    }
  }

  /**
   * Get attendance trend data (monthly)
   */
  async getAttendanceTrend() {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const attendanceData = await prisma.attendance.groupBy({
        by: ["date"],
        where: {
          date: {
            gte: sixMonthsAgo,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          date: "asc",
        },
      });

      // Group by month
      const monthlyData: Record<string, number> = {};
      const months = [
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
      ];

      attendanceData.forEach((record) => {
        const monthIndex = record.date.getMonth();
        const month = months[monthIndex];
        monthlyData[month] = (monthlyData[month] || 0) + record._count.id;
      });

      return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      }));
    } catch (error) {
      throw new Error("Failed to fetch attendance trend");
    }
  }

  /**
   * Get performance by subject (average marks)
   */
  async getPerformanceBySubject() {
    try {
      const results = await prisma.examResult.groupBy({
        by: ["id"],
        _avg: {
          marksObtained: true,
        },
      });

      // Get subjects with their performance
      const subjectsPerformance = await prisma.subject.findMany({
        select: {
          id: true,
          name: true,
          exams: {
            select: {
              results: {
                select: {
                  marksObtained: true,
                },
              },
            },
          },
        },
      });

      return subjectsPerformance.map((subject) => {
        const marks = subject.exams.flatMap((exam) =>
          exam.results.map((r) => r.marksObtained)
        );
        const avgMarks =
          marks.length > 0
            ? Math.round(marks.reduce((a, b) => a + b, 0) / marks.length)
            : 0;

        return {
          subject: subject.name,
          averageMarks: avgMarks,
        };
      });
    } catch (error) {
      throw new Error("Failed to fetch performance by subject");
    }
  }

  /**
   * Get today's attendance statistics
   */
  async getTodayAttendance() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendanceRecords = await prisma.attendance.findMany({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: {
          student: true,
        },
      });

      const total = attendanceRecords.length;
      const present = attendanceRecords.filter(
        (a) => a.status === "PRESENT"
      ).length;
      const absent = attendanceRecords.filter(
        (a) => a.status === "ABSENT"
      ).length;
      const late = attendanceRecords.filter(
        (a) => a.status === "LATE"
      ).length;

      return {
        total,
        present,
        absent,
        late,
        presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
        absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
        latePercentage: total > 0 ? Math.round((late / total) * 100) : 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch today's attendance");
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10) {
    try {
      const activities = await prisma.activityLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return activities.map((activity) => ({
        id: activity.id,
        user: activity.user.name,
        email: activity.user.email,
        action: activity.action,
        description: activity.description,
        timestamp: activity.createdAt,
      }));
    } catch (error) {
      throw new Error("Failed to fetch recent activity");
    }
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData() {
    try {
      const [stats, attendanceTrend, performance, todayAttendance, recentActivity] =
        await Promise.all([
          this.getOverallStats(),
          this.getAttendanceTrend(),
          this.getPerformanceBySubject(),
          this.getTodayAttendance(),
          this.getRecentActivity(),
        ]);

      return {
        success: true,
        data: {
          stats,
          attendanceTrend,
          performance,
          todayAttendance,
          recentActivity,
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch dashboard data");
    }
  }
}

export default new AdminDashboardService();
