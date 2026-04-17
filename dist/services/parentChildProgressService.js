"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
const gradeUtils_js_1 = require("../utils/gradeUtils.js");
class ParentChildProgressService {
    async resolveParentId(userId) {
        const parent = await prisma_js_1.prisma.parent.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!parent) {
            throw new Error("Parent not found");
        }
        return parent.id;
    }
    async resolveAuthorizedStudentId(parentId, studentOrEnrollmentId) {
        const relation = await prisma_js_1.prisma.parentStudent.findFirst({
            where: {
                parentId,
                OR: [
                    { studentId: studentOrEnrollmentId },
                    { id: studentOrEnrollmentId },
                ],
            },
            select: { studentId: true },
        });
        if (!relation) {
            throw new Error("Unauthorized: Child not found for this parent");
        }
        return relation.studentId;
    }
    // Get overall progress metrics
    async getProgressMetrics(userId, studentId) {
        try {
            const parentId = await this.resolveParentId(userId);
            const resolvedStudentId = await this.resolveAuthorizedStudentId(parentId, studentId);
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: resolvedStudentId },
                select: {
                    id: true,
                    user: { select: { name: true } },
                    class: {
                        select: {
                            id: true,
                            students: { select: { id: true } },
                        },
                    },
                },
            });
            // Get current grade
            const results = await prisma_js_1.prisma.examResult.findMany({
                where: { studentId: resolvedStudentId },
                select: {
                    marksObtained: true,
                    exam: {
                        select: {
                            totalMarks: true,
                        },
                    },
                },
            });
            let totalMarks = 0;
            let totalMarksCount = 0;
            results.forEach((result) => {
                if (result.marksObtained !== null) {
                    totalMarks += result.marksObtained;
                    totalMarksCount += result.exam.totalMarks;
                }
            });
            const currentPercentage = totalMarksCount > 0 ? Math.round((totalMarks / totalMarksCount) * 100) : 0;
            // Get class rank
            const allResults = await prisma_js_1.prisma.examResult.findMany({
                where: { exam: { classId: student?.class?.id } },
                select: {
                    studentId: true,
                    marksObtained: true,
                    exam: {
                        select: {
                            totalMarks: true,
                        },
                    },
                },
            });
            const studentAverages = {};
            allResults.forEach((result) => {
                if (result.marksObtained !== null) {
                    if (!studentAverages[result.studentId]) {
                        studentAverages[result.studentId] = 0;
                    }
                    studentAverages[result.studentId] +=
                        (result.marksObtained / result.exam.totalMarks) * 100;
                }
            });
            let rank = 1;
            Object.entries(studentAverages).forEach(([id, avg]) => {
                if (avg > currentPercentage) {
                    rank++;
                }
            });
            // Get attendance
            const attendance = await prisma_js_1.prisma.attendance.findMany({
                where: { studentId: resolvedStudentId },
                select: { status: true },
            });
            const presentDays = attendance.filter((a) => a.status === "PRESENT").length;
            const attendancePercentage = attendance.length > 0
                ? Math.round((presentDays / attendance.length) * 100)
                : 0;
            // Get average score
            const avgScore = currentPercentage;
            return {
                success: true,
                data: {
                    studentName: student?.user?.name || "Unknown",
                    currentGrade: (0, gradeUtils_js_1.calculateGrade)(currentPercentage),
                    classRank: {
                        rank,
                        totalStudents: student?.class?.students?.length || 0,
                    },
                    attendance: attendancePercentage,
                    avgScore,
                },
            };
        }
        catch (error) {
            console.error("Error fetching progress metrics:", error);
            throw error;
        }
    }
    // Get progress over time (grades/percentages by month)
    async getProgressOverTime(userId, studentId, months = 6) {
        try {
            const parentId = await this.resolveParentId(userId);
            const resolvedStudentId = await this.resolveAuthorizedStudentId(parentId, studentId);
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - months);
            const results = await prisma_js_1.prisma.examResult.findMany({
                where: {
                    studentId: resolvedStudentId,
                    exam: {
                        date: { gte: startDate },
                    },
                },
                select: {
                    marksObtained: true,
                    exam: {
                        select: {
                            date: true,
                            totalMarks: true,
                        },
                    },
                },
                orderBy: { exam: { date: "asc" } },
            });
            // Group by month
            const monthlyData = {};
            results.forEach((result) => {
                const monthKey = result.exam.date.toISOString().substring(0, 7);
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { marks: [], totals: [] };
                }
                if (result.marksObtained !== null) {
                    monthlyData[monthKey].marks.push(result.marksObtained);
                    monthlyData[monthKey].totals.push(result.exam.totalMarks);
                }
            });
            return {
                success: true,
                data: Object.entries(monthlyData)
                    .sort()
                    .map(([month, data]) => {
                    const totalMarks = data.marks.reduce((a, b) => a + b, 0);
                    const totalCount = data.totals.reduce((a, b) => a + b, 0);
                    const percentage = totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;
                    return {
                        month,
                        percentage,
                        grade: (0, gradeUtils_js_1.calculateGrade)(percentage),
                    };
                }),
            };
        }
        catch (error) {
            console.error("Error fetching progress over time:", error);
            throw error;
        }
    }
    // Get subject-wise performance with comparison
    async getSubjectWisePerformance(userId, studentId) {
        try {
            const parentId = await this.resolveParentId(userId);
            const resolvedStudentId = await this.resolveAuthorizedStudentId(parentId, studentId);
            const results = await prisma_js_1.prisma.examResult.findMany({
                where: { studentId: resolvedStudentId },
                select: {
                    marksObtained: true,
                    exam: {
                        select: {
                            totalMarks: true,
                            subject: { select: { id: true, name: true } },
                            classId: true,
                        },
                    },
                },
            });
            const subjectMap = {};
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
                    subjectMap[subjectId].totals.push(result.exam.totalMarks);
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
            console.error("Error fetching subject-wise performance:", error);
            throw error;
        }
    }
    // Get exam results with trends
    async getExamResultsWithTrends(userId, studentId, limit = 10) {
        try {
            const parentId = await this.resolveParentId(userId);
            const resolvedStudentId = await this.resolveAuthorizedStudentId(parentId, studentId);
            const results = await prisma_js_1.prisma.examResult.findMany({
                where: { studentId: resolvedStudentId },
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
                        },
                    },
                },
                orderBy: { exam: { date: "desc" } },
                take: limit,
            });
            // Calculate trends (improvement/decline)
            const examResults = results.map((result, index) => {
                const percentage = result.marksObtained !== null
                    ? Math.round((result.marksObtained / result.exam.totalMarks) * 100)
                    : 0;
                let trend = null;
                if (index < results.length - 1) {
                    const previousPercentage = results[index + 1].marksObtained !== null
                        ? Math.round((results[index + 1].marksObtained /
                            results[index + 1].exam.totalMarks) *
                            100)
                        : 0;
                    if (percentage > previousPercentage) {
                        trend = "up";
                    }
                    else if (percentage < previousPercentage) {
                        trend = "down";
                    }
                    else {
                        trend = "stable";
                    }
                }
                return {
                    id: result.id,
                    subject: result.exam.subject.name,
                    examName: result.exam.name,
                    date: result.exam.date.toISOString().split("T")[0],
                    marksObtained: result.marksObtained,
                    totalMarks: result.exam.totalMarks,
                    percentage,
                    grade: (0, gradeUtils_js_1.calculateGrade)(percentage),
                    trend,
                };
            });
            return {
                success: true,
                data: examResults,
            };
        }
        catch (error) {
            console.error("Error fetching exam results with trends:", error);
            throw error;
        }
    }
    // Get performance summary
    async getPerformanceSummary(userId, studentId) {
        try {
            const parentId = await this.resolveParentId(userId);
            const resolvedStudentId = await this.resolveAuthorizedStudentId(parentId, studentId);
            const results = await prisma_js_1.prisma.examResult.findMany({
                where: { studentId: resolvedStudentId },
                select: {
                    marksObtained: true,
                    exam: {
                        select: {
                            totalMarks: true,
                        },
                    },
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
                        gradeDistribution: {},
                    },
                };
            }
            let totalMarks = 0;
            let totalCount = 0;
            let highest = 0;
            let lowest = 100;
            const gradeCount = {
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
                    const percentage = Math.round((result.marksObtained / result.exam.totalMarks) * 100);
                    totalMarks += result.marksObtained;
                    totalCount += result.exam.totalMarks;
                    if (percentage > highest)
                        highest = percentage;
                    if (percentage < lowest)
                        lowest = percentage;
                    const grade = (0, gradeUtils_js_1.calculateGrade)(percentage);
                    gradeCount[grade]++;
                }
            });
            const averagePercentage = totalCount > 0 ? Math.round((totalMarks / totalCount) * 100) : 0;
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
        }
        catch (error) {
            console.error("Error fetching performance summary:", error);
            throw error;
        }
    }
}
exports.default = new ParentChildProgressService();
