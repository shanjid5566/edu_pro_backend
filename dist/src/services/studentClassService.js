"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
class StudentClassService {
    // Get all classes for the student
    async getMyClasses(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    class: {
                        select: {
                            id: true,
                            name: true,
                            section: true,
                            subjects: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            teachers: {
                                select: {
                                    teacher: {
                                        select: {
                                            id: true,
                                            user: { select: { name: true } },
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
                    class: {
                        id: student.class.id,
                        name: student.class.name,
                        section: student.class.section,
                    },
                    subjects: student.class.subjects.map((s) => ({
                        id: s.id,
                        name: s.name,
                    })),
                    totalSubjects: student.class.subjects.length,
                    teachers: student.class.teachers.map((tc) => ({
                        id: tc.teacher.id,
                        name: tc.teacher.user.name,
                    })),
                },
            };
        }
        catch (error) {
            console.error("Error fetching my classes:", error);
            throw error;
        }
    }
    // Get class schedule by day
    async getClassScheduleByDay(studentId, day) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: { classId: true },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            let where = { classId: student.classId };
            if (day) {
                where.day = day;
            }
            const schedule = await prisma_js_1.prisma.classSchedule.findMany({
                where,
                select: {
                    id: true,
                    day: true,
                    startTime: true,
                    endTime: true,
                    roomNumber: true,
                    subject: {
                        select: { id: true, name: true },
                    },
                    teacher: {
                        select: {
                            id: true,
                            user: { select: { name: true } },
                        },
                    },
                },
                orderBy: [{ day: "asc" }, { startTime: "asc" }],
            });
            // Group by day
            const groupedByDay = {};
            schedule.forEach((s) => {
                if (!groupedByDay[s.day]) {
                    groupedByDay[s.day] = [];
                }
                groupedByDay[s.day].push({
                    scheduleId: s.id,
                    subject: s.subject.name,
                    teacher: s.teacher.user.name,
                    time: `${s.startTime} - ${s.endTime}`,
                    room: s.roomNumber,
                });
            });
            // Sort days in order
            const dayOrder = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ];
            const sortedDays = Object.keys(groupedByDay).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
            const scheduleData = sortedDays.map((dayName) => ({
                day: dayName,
                classes: groupedByDay[dayName],
                totalClasses: groupedByDay[dayName].length,
            }));
            return {
                success: true,
                data: scheduleData,
            };
        }
        catch (error) {
            console.error("Error fetching class schedule:", error);
            throw error;
        }
    }
    // Get today's classes
    async getTodayClasses(studentId) {
        try {
            const today = new Date();
            const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: { classId: true },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const schedule = await prisma_js_1.prisma.classSchedule.findMany({
                where: { classId: student.classId, day: dayName },
                select: {
                    id: true,
                    startTime: true,
                    endTime: true,
                    roomNumber: true,
                    subject: {
                        select: { id: true, name: true },
                    },
                    teacher: {
                        select: {
                            id: true,
                            user: { select: { name: true } },
                        },
                    },
                },
                orderBy: { startTime: "asc" },
            });
            return {
                success: true,
                data: {
                    day: dayName,
                    classes: schedule.map((s) => ({
                        scheduleId: s.id,
                        subject: s.subject.name,
                        teacher: s.teacher.user.name,
                        time: `${s.startTime} - ${s.endTime}`,
                        room: s.roomNumber,
                    })),
                    totalClasses: schedule.length,
                },
            };
        }
        catch (error) {
            console.error("Error fetching today's classes:", error);
            throw error;
        }
    }
    // Get subject details with teacher
    async getSubjectDetails(studentId, subjectId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: { classId: true },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const subject = await prisma_js_1.prisma.subject.findFirst({
                where: {
                    id: subjectId,
                    teachers: { some: { teacher: { classes: { some: { classId: student.classId } } } } },
                },
                select: {
                    id: true,
                    name: true,
                    teachers: {
                        select: {
                            teacher: {
                                select: {
                                    id: true,
                                    user: { select: { name: true, email: true } },
                                },
                            },
                        },
                    },
                    exams: {
                        where: {
                            classes: { some: { id: student.classId } },
                        },
                        select: {
                            id: true,
                            name: true,
                            date: true,
                            status: true,
                        },
                    },
                },
            });
            if (!subject) {
                throw new Error("Subject not found");
            }
            return {
                success: true,
                data: {
                    id: subject.id,
                    name: subject.name,
                    teachers: subject.teachers.map((st) => ({
                        id: st.teacher.id,
                        name: st.teacher.user.name,
                        email: st.teacher.user.email,
                    })),
                    upcomingExams: subject.exams.filter((e) => e.status === "UPCOMING"),
                    ongoingExams: subject.exams.filter((e) => e.status === "ONGOING"),
                    completedExams: subject.exams.filter((e) => e.status === "COMPLETED"),
                },
            };
        }
        catch (error) {
            console.error("Error fetching subject details:", error);
            throw error;
        }
    }
    // Get weekly timetable
    async getWeeklyTimetable(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: { classId: true },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const schedule = await prisma_js_1.prisma.classSchedule.findMany({
                where: { classId: student.classId },
                select: {
                    id: true,
                    day: true,
                    startTime: true,
                    endTime: true,
                    roomNumber: true,
                    subject: {
                        select: { id: true, name: true },
                    },
                    teacher: {
                        select: {
                            id: true,
                            user: { select: { name: true } },
                        },
                    },
                },
                orderBy: [{ day: "asc" }, { startTime: "asc" }],
            });
            const dayOrder = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ];
            // Create timetable matrix
            const timetable = {};
            dayOrder.forEach((day) => {
                timetable[day] = [];
            });
            schedule.forEach((s) => {
                if (timetable[s.day]) {
                    timetable[s.day].push({
                        scheduleId: s.id,
                        subject: s.subject.name,
                        teacher: s.teacher.user.name,
                        startTime: s.startTime,
                        endTime: s.endTime,
                        room: s.roomNumber,
                    });
                }
            });
            return {
                success: true,
                data: timetable,
            };
        }
        catch (error) {
            console.error("Error fetching weekly timetable:", error);
            throw error;
        }
    }
}
exports.default = new StudentClassService();
