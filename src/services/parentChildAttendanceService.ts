import { prisma } from "../lib/prisma.js";

class ParentChildAttendanceService {
  // Get attendance summary
  async getAttendanceSummary(parentId: string, studentId: string) {
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

      const attendance = await prisma.attendance.findMany({
        where: { studentId },
        select: { status: true },
      });

      let presentDays = 0;
      let absentDays = 0;
      let lateDays = 0;

      attendance.forEach((record) => {
        if (record.status === "PRESENT") presentDays++;
        else if (record.status === "ABSENT") absentDays++;
        else if (record.status === "LATE") lateDays++;
      });

      const totalDays = attendance.length;
      const attendancePercentage =
        totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      return {
        success: true,
        data: {
          presentDays,
          absentDays,
          lateDays,
          totalDays,
          attendancePercentage,
          status:
            attendancePercentage >= 85
              ? "Excellent"
              : attendancePercentage >= 75
              ? "Good"
              : "Need Improvement",
        },
      };
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      throw error;
    }
  }

  // Get attendance trend
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

  // Get recent attendance records
  async getRecentAttendance(parentId: string, studentId: string, limit: number = 10) {
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

      const recentRecords = await prisma.attendance.findMany({
        where: { studentId },
        select: {
          id: true,
          date: true,
          status: true,
        },
        orderBy: { date: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: recentRecords.map((record) => ({
          id: record.id,
          date: record.date.toISOString().split("T")[0],
          dayName: this.getDayName(record.date),
          status: record.status,
          statusLabel:
            record.status === "PRESENT"
              ? "Present"
              : record.status === "ABSENT"
              ? "Absent"
              : "Late",
        })),
      };
    } catch (error) {
      console.error("Error fetching recent attendance:", error);
      throw error;
    }
  }

  // Get attendance by date range
  async getAttendanceByDateRange(
    parentId: string,
    studentId: string,
    startDate: string,
    endDate: string
  ) {
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

      const start = new Date(startDate);
      const end = new Date(endDate);

      const records = await prisma.attendance.findMany({
        where: {
          studentId,
          date: {
            gte: start,
            lte: end,
          },
        },
        select: {
          id: true,
          date: true,
          status: true,
        },
        orderBy: { date: "desc" },
      });

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;

      records.forEach((record) => {
        if (record.status === "PRESENT") presentCount++;
        else if (record.status === "ABSENT") absentCount++;
        else if (record.status === "LATE") lateCount++;
      });

      return {
        success: true,
        data: {
          period: {
            startDate,
            endDate,
          },
          summary: {
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            total: records.length,
            percentage:
              records.length > 0
                ? Math.round((presentCount / records.length) * 100)
                : 0,
          },
          records: records.map((record) => ({
            id: record.id,
            date: record.date.toISOString().split("T")[0],
            dayName: this.getDayName(record.date),
            status: record.status,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching attendance by date range:", error);
      throw error;
    }
  }

  // Get attendance statistics
  async getAttendanceStatistics(parentId: string, studentId: string) {
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

      const attendance = await prisma.attendance.findMany({
        where: { studentId },
        select: { status: true },
      });

      let presentDays = 0;
      let absentDays = 0;
      let lateDays = 0;

      attendance.forEach((record) => {
        if (record.status === "PRESENT") presentDays++;
        else if (record.status === "ABSENT") absentDays++;
        else if (record.status === "LATE") lateDays++;
      });

      const totalDays = attendance.length;

      return {
        success: true,
        data: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          presentPercentage:
            totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
          absentPercentage:
            totalDays > 0 ? Math.round((absentDays / totalDays) * 100) : 0,
          latePercentage:
            totalDays > 0 ? Math.round((lateDays / totalDays) * 100) : 0,
          overallAttendance:
            totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching attendance statistics:", error);
      throw error;
    }
  }

  // Helper function to get day name
  private getDayName(date: Date): string {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }
}

export default new ParentChildAttendanceService();
