"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const prisma_1 = require("../lib/prisma");
const enums_1 = require("../../prisma/generated/prisma/enums");
exports.dashboardService = {
    // Get dashboard overview counts
    async getOverview() {
        try {
            const [totalStudents, totalTeachers, totalClasses, totalParents] = await Promise.all([
                prisma_1.prisma.user.count({ where: { role: enums_1.UserRole.STUDENT } }),
                prisma_1.prisma.user.count({ where: { role: enums_1.UserRole.TEACHER } }),
                prisma_1.prisma.class.count(),
                prisma_1.prisma.user.count({ where: { role: enums_1.UserRole.PARENT } }),
            ]);
            return {
                totalStudents,
                totalTeachers,
                totalClasses,
                totalParents,
            };
        }
        catch (error) {
            throw new Error(`Failed to get dashboard overview: ${error}`);
        }
    },
    // Get attendance trend (last 6 months)
    async getAttendanceTrend() {
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const attendanceData = await prisma_1.prisma.attendance.groupBy({
                by: ["date"],
                where: {
                    date: { gte: sixMonthsAgo },
                },
                _count: {
                    id: true,
                },
                orderBy: { date: "asc" },
            });
            // Format data for chart
            const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
            const trendData = months.map((month) => {
                const monthStart = new Date();
                monthStart.setMonth(monthStart.getMonth() - months.length + months.indexOf(month) + 1);
                monthStart.setDate(1);
                const monthEnd = new Date(monthStart);
                monthEnd.setMonth(monthEnd.getMonth() + 1);
                monthEnd.setDate(0);
                const monthData = attendanceData.filter((d) => d.date >= monthStart && d.date <= monthEnd);
                const totalPresent = monthData.reduce((sum, d) => sum + d._count.id, 0);
                const percentage = totalPresent > 0 ? Math.round((totalPresent / 100) * 100) : 0;
                return {
                    month,
                    percentage: Math.min(100, percentage),
                };
            });
            return trendData;
        }
        catch (error) {
            throw new Error(`Failed to get attendance trend: ${error}`);
        }
    },
    // Get performance by subject (average marks)
    async getPerformanceBySubject() {
        try {
            const subjects = await prisma_1.prisma.subject.findMany({
                include: {
                    examResults: true,
                },
            });
            const performanceData = subjects.map((subject) => {
                const totalMarks = subject.examResults.reduce((sum, result) => sum + (result.marksObtained || 0), 0);
                const average = subject.examResults.length > 0
                    ? Math.round(totalMarks / subject.examResults.length)
                    : 0;
                return {
                    subject: subject.name,
                    average: Math.min(100, average),
                };
            });
            return performanceData;
        }
        catch (error) {
            throw new Error(`Failed to get performance by subject: ${error}`);
        }
    },
    // Get today's attendance summary
    async getTodayAttendance() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const [present, absent, late] = await Promise.all([
                prisma_1.prisma.attendance.count({
                    where: {
                        date: { gte: today, lt: tomorrow },
                        status: enums_1.AttendanceStatus.PRESENT,
                    },
                }),
                prisma_1.prisma.attendance.count({
                    where: {
                        date: { gte: today, lt: tomorrow },
                        status: enums_1.AttendanceStatus.ABSENT,
                    },
                }),
                prisma_1.prisma.attendance.count({
                    where: {
                        date: { gte: today, lt: tomorrow },
                        status: enums_1.AttendanceStatus.LATE,
                    },
                }),
            ]);
            const total = present + absent + late || 1;
            const presentPercent = Math.round((present / total) * 100);
            const absentPercent = Math.round((absent / total) * 100);
            const latePercent = Math.round((late / total) * 100);
            return {
                present,
                absent,
                late,
                presentPercent,
                absentPercent,
                latePercent,
                total,
            };
        }
        catch (error) {
            throw new Error(`Failed to get today's attendance: ${error}`);
        }
    },
    // Get recent activity logs
    async getRecentActivity(limit = 5) {
        try {
            const activities = await prisma_1.prisma.activityLog.findMany({
                orderBy: { createdAt: "desc" },
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        },
                    },
                },
            });
            return activities.map((activity) => ({
                id: activity.id,
                description: activity.description,
                action: activity.action,
                userName: activity.user?.name,
                userRole: activity.user?.role,
                timestamp: activity.createdAt,
            }));
        }
        catch (error) {
            throw new Error(`Failed to get recent activity: ${error}`);
        }
    },
    // Get complete dashboard data
    async getDashboardData() {
        try {
            const [overview, attendanceTrend, performanceBySubject, todayAttendance, recentActivity] = await Promise.all([
                this.getOverview(),
                this.getAttendanceTrend(),
                this.getPerformanceBySubject(),
                this.getTodayAttendance(),
                this.getRecentActivity(),
            ]);
            return {
                overview,
                charts: {
                    attendanceTrend,
                    performanceBySubject,
                },
                todayAttendance,
                recentActivity,
            };
        }
        catch (error) {
            throw new Error(`Failed to get dashboard data: ${error}`);
        }
    },
};
exports.default = exports.dashboardService;
