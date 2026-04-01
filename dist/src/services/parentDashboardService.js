"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
const gradeUtils_js_1 = require("../utils/gradeUtils.js");
const dateUtils_js_1 = require("../utils/dateUtils.js");
class ParentDashboardService {
    // Get all children
    async getMyChildren(parentId) {
        try {
            const parent = await prisma_js_1.prisma.parent.findUnique({
                where: { id: parentId },
                select: {
                    students: {
                        select: {
                            id: true,
                            studentId: true,
                            student: {
                                select: {
                                    id: true,
                                    user: { select: { name: true, email: true } },
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
                data: parent.students.map((parentStudent) => ({
                    enrollmentId: parentStudent.id,
                    studentId: parentStudent.student.id,
                    name: parentStudent.student.user.name,
                    email: parentStudent.student.user.email,
                    class: `${parentStudent.student.class.name}-${parentStudent.student.class.section}`,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching my children:", error);
            throw error;
        }
    }
    // Get child overview
    async getChildOverview(parentId, studentId) {
        try {
            // Verify parent-child relationship through ParentStudent
            const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
                where: {
                    parentId,
                    studentId,
                },
            });
            if (!parentStudent) {
                throw new Error("Unauthorized: Child not found for this parent");
            }
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    id: true,
                    user: { select: { name: true } },
                    class: {
                        select: {
                            id: true,
                            name: true,
                            section: true,
                            totalStudents: true,
                        },
                    },
                },
            });
            // Get attendance
            const attendance = await prisma_js_1.prisma.attendance.findMany({
                where: { studentId },
                select: { status: true },
            });
            const presentDays = attendance.filter((a) => a.status === "PRESENT").length;
            const attendancePercentage = attendance.length > 0
                ? Math.round((presentDays / attendance.length) * 100)
                : 0;
            // Get overall grade
            const results = await prisma_js_1.prisma.examResult.findMany({
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
            const overallPercentage = totalMarksCount > 0 ? Math.round((totalMarks / totalMarksCount) * 100) : 0;
            const allResults = await prisma_js_1.prisma.examResult.findMany({
                where: { exam: { class: { id: student?.class?.id } } },
                select: { studentId: true, marksObtained: true },
            });
            const studentAverages = {};
            allResults.forEach((result) => {
                if (result.marksObtained !== null) {
                    if (!studentAverages[result.studentId]) {
                        studentAverages[result.studentId] = 0;
                    }
                    studentAverages[result.studentId] += result.marksObtained;
                }
            });
            let rank = 1;
            Object.entries(studentAverages).forEach(([id, avg]) => {
                if (avg > totalMarks) {
                    rank++;
                }
            });
            // Get subject count  
            const subjectsCount = await prisma_js_1.prisma.subject.count({
                where: {
                    exams: { some: { class: { id: student?.class?.id } } },
                },
            });
            return {
                success: true,
                data: {
                    studentName: student?.user?.name || "Unknown",
                    class: `${student?.class?.name}-${student?.class?.section}` || "Unknown",
                    attendance: {
                        percentage: attendancePercentage,
                        status: attendancePercentage >= 85
                            ? "Excellent"
                            : attendancePercentage >= 75
                                ? "Good"
                                : "Need Improvement",
                    },
                    overallGrade: (0, gradeUtils_js_1.calculateGrade)(overallPercentage),
                    subjects: subjectsCount,
                    classRank: rank,
                    totalClassSize: student?.class?.totalStudents || 0,
                },
            };
        }
        catch (error) {
            console.error("Error fetching child overview:", error);
            throw error;
        }
    }
    // Get child attendance trend
    async getAttendanceTrend(parentId, studentId, months = 6) {
        try {
            // Verify parent-child relationship through ParentStudent
            const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
                where: {
                    parentId,
                    studentId,
                },
            });
            if (!parentStudent) {
                throw new Error("Unauthorized: Child not found for this parent");
            }
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - months);
            const attendance = await prisma_js_1.prisma.attendance.findMany({
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
            const monthlyData = {};
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
                    percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
                    presentDays: data.present,
                    totalDays: data.total,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching attendance trend:", error);
            throw error;
        }
    }
    // Get child recent results
    async getRecentResults(parentId, studentId, limit = 5) {
        try {
            // Verify parent-child relationship through ParentStudent
            const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
                where: {
                    parentId,
                    studentId,
                },
            });
            if (!parentStudent) {
                throw new Error("Unauthorized: Child not found for this parent");
            }
            const results = await prisma_js_1.prisma.examResult.findMany({
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
                    percentage: result.marksObtained !== null
                        ? Math.round((result.marksObtained / result.totalMarks) * 100)
                        : 0,
                    grade: (0, gradeUtils_js_1.calculateGrade)(result.marksObtained !== null
                        ? Math.round((result.marksObtained / result.totalMarks) * 100)
                        : 0),
                })),
            };
        }
        catch (error) {
            console.error("Error fetching recent results:", error);
            throw error;
        }
    }
    // Get child subject performance
    async getSubjectPerformance(parentId, studentId) {
        try {
            // Verify parent-child relationship through ParentStudent
            const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
                where: {
                    parentId,
                    studentId,
                },
            });
            if (!parentStudent) {
                throw new Error("Unauthorized: Child not found for this parent");
            }
            const results = await prisma_js_1.prisma.examResult.findMany({
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
            const subjectMap = {};
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
                const percentage = totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;
                return {
                    subjectId: id,
                    subject: data.name,
                    percentage,
                    grade: (0, gradeUtils_js_1.calculateGrade)(percentage),
                    exams: data.marks.length,
                };
            });
            return {
                success: true,
                data: subjectPerformance.sort((a, b) => b.percentage - a.percentage),
            };
        }
        catch (error) {
            console.error("Error fetching subject performance:", error);
            throw error;
        }
    }
    // Get child upcoming events
    async getUpcomingEvents(parentId, studentId, limit = 5) {
        try {
            // Verify parent-child relationship through ParentStudent
            const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
                where: {
                    parentId,
                    studentId,
                },
            });
            if (!parentStudent) {
                throw new Error("Unauthorized: Child not found for this parent");
            }
            const today = new Date();
            // Get upcoming exams
            const exams = await prisma_js_1.prisma.exam.findMany({
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
                    daysAway: Math.ceil((exam.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
                })),
            };
        }
        catch (error) {
            console.error("Error fetching upcoming events:", error);
            throw error;
        }
    }
    // Get notifications for child
    async getNotifications(parentId, studentId, limit = 5) {
        try {
            // Verify parent-child relationship through ParentStudent
            const parentStudent = await prisma_js_1.prisma.parentStudent.findFirst({
                where: {
                    parentId,
                    studentId,
                },
            });
            if (!parentStudent) {
                throw new Error("Unauthorized: Child not found for this parent");
            }
            const notices = await prisma_js_1.prisma.notice.findMany({
                select: {
                    id: true,
                    title: true,
                    message: true,
                    createdAt: true,
                    category: true,
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            });
            return {
                success: true,
                data: notices.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    message: notice.message.substring(0, 100) + "...",
                    category: notice.category,
                    date: notice.createdAt.toISOString().split("T")[0],
                    timeAgo: (0, dateUtils_js_1.getTimeAgo)(notice.createdAt),
                })),
            };
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    }
}
exports.default = new ParentDashboardService();
