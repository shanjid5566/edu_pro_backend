import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { noticeService } from "./notice.service.js";
export class StudentDashboardService {
    getMonthLabel(date) {
        return date.toLocaleString("en-US", { month: "short" });
    }
    getLetterGrade(average) {
        if (average >= 90)
            return "A+";
        if (average >= 80)
            return "A";
        if (average >= 70)
            return "B";
        if (average >= 60)
            return "C";
        if (average >= 50)
            return "D";
        return "F";
    }
    async getStudentByUserId(userId) {
        const student = await db.student.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                class: {
                    include: {
                        subjects: {
                            include: {
                                subject: {
                                    select: {
                                        id: true,
                                        name: true,
                                        code: true,
                                    },
                                },
                            },
                        },
                        teachers: {
                            include: {
                                teacher: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                attendances: {
                    select: {
                        date: true,
                        status: true,
                    },
                },
                examResults: {
                    include: {
                        exam: {
                            include: {
                                subject: {
                                    select: {
                                        id: true,
                                        name: true,
                                        code: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!student) {
            throw new NotFoundError("Student profile not found for this user");
        }
        return student;
    }
    async getStudentRankInClass(classId, studentId) {
        const classmates = await db.student.findMany({
            where: { classId },
            include: {
                examResults: {
                    select: {
                        marksObtained: true,
                    },
                },
            },
        });
        const ranked = classmates
            .map((s) => {
            const average = s.examResults.length
                ? s.examResults.reduce((sum, r) => sum + r.marksObtained, 0) / s.examResults.length
                : 0;
            return {
                studentId: s.id,
                average,
            };
        })
            .sort((a, b) => b.average - a.average);
        const index = ranked.findIndex((r) => r.studentId === studentId);
        return index >= 0 ? index + 1 : null;
    }
    async getStudentDashboard(userId) {
        const student = await this.getStudentByUserId(userId);
        const subjects = student.class.subjects.map((cs) => cs.subject);
        const attendanceTotal = student.attendances.length;
        const attendancePresent = student.attendances.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
        const attendancePercentage = attendanceTotal
            ? Math.round((attendancePresent / attendanceTotal) * 100)
            : 0;
        const resultAverage = student.examResults.length
            ? Math.round(student.examResults.reduce((sum, r) => sum + r.marksObtained, 0) /
                student.examResults.length)
            : 0;
        const overallGrade = student.grade || this.getLetterGrade(resultAverage);
        const rank = await this.getStudentRankInClass(student.classId, student.id);
        const now = new Date();
        const attendanceTrend = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const records = student.attendances.filter((a) => a.date >= start && a.date <= end);
            const present = records.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
            const percentage = records.length ? Math.round((present / records.length) * 100) : 0;
            attendanceTrend.push({
                month: this.getMonthLabel(start),
                percentage,
            });
        }
        const bySubject = new Map();
        student.examResults.forEach((result) => {
            const subjectId = result.exam.subject.id;
            if (!bySubject.has(subjectId)) {
                bySubject.set(subjectId, {
                    name: result.exam.subject.name,
                    marks: [],
                });
            }
            bySubject.get(subjectId).marks.push(result.marksObtained);
        });
        const subjectPerformance = Array.from(bySubject.values()).map((entry) => {
            const avg = entry.marks.length
                ? Math.round(entry.marks.reduce((sum, value) => sum + value, 0) / entry.marks.length)
                : 0;
            return {
                subject: entry.name,
                percentage: Math.max(0, Math.min(100, avg)),
            };
        });
        return {
            title: "Student Dashboard",
            subtitle: `Welcome back, ${student.user.name}! Track your academic progress.`,
            stats: {
                mySubjects: subjects.length,
                attendance: attendancePercentage,
                overallGrade,
                rank,
            },
            charts: {
                attendanceTrend,
                subjectPerformance,
            },
        };
    }
    async getStudentClasses(userId) {
        const student = await this.getStudentByUserId(userId);
        const subjects = student.class.subjects.map((cs) => cs.subject);
        const subjectIds = subjects.map((s) => s.id);
        const teacherSubjects = await db.teacherSubject.findMany({
            where: {
                subjectId: { in: subjectIds },
                teacher: {
                    classes: {
                        some: {
                            classId: student.classId,
                        },
                    },
                },
            },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                subject: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const teacherBySubject = new Map();
        teacherSubjects.forEach((ts) => {
            if (!teacherBySubject.has(ts.subjectId)) {
                teacherBySubject.set(ts.subjectId, ts.teacher.user.name);
            }
        });
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const slots = ["8:00", "9:00", "10:00", "11:00", "1:00"];
        const schedule = [];
        days.forEach((day, dayIndex) => {
            slots.forEach((time, slotIndex) => {
                const subject = subjects[(dayIndex + slotIndex) % Math.max(subjects.length, 1)];
                if (!subject) {
                    return;
                }
                const roomSeed = (dayIndex + slotIndex) % 4;
                const room = roomSeed === 0 ? "201" : roomSeed === 1 ? "Lab 1" : roomSeed === 2 ? "Lab 2" : "CS Lab";
                schedule.push({
                    day,
                    time,
                    subject: subject.name,
                    teacher: teacherBySubject.get(subject.id) || "Assigned Teacher",
                    room,
                });
            });
        });
        return {
            class: {
                id: student.class.id,
                name: student.class.name,
                section: student.class.section,
            },
            subjects: subjects.map((s) => ({
                id: s.id,
                name: s.name,
                code: s.code,
            })),
            weeklySchedule: schedule,
        };
    }
    async getStudentExams(userId, status) {
        const student = await this.getStudentByUserId(userId);
        const where = { classId: student.classId };
        if (status) {
            const normalized = status.toUpperCase();
            if (!["UPCOMING", "ONGOING", "COMPLETED"].includes(normalized)) {
                throw new BadRequestError("status must be one of UPCOMING, ONGOING, COMPLETED");
            }
            where.status = normalized;
        }
        const exams = await db.exam.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: {
                date: "asc",
            },
        });
        const nextUpcoming = exams.find((e) => e.status === "UPCOMING");
        return {
            alert: nextUpcoming
                ? {
                    title: `${nextUpcoming.name} starts on ${nextUpcoming.date.toDateString()}`,
                    message: "Make sure to prepare well and arrive 15 minutes early.",
                }
                : null,
            exams: exams.map((exam, index) => ({
                id: exam.id,
                examName: exam.name,
                subject: exam.subject.name,
                date: exam.date,
                duration: exam.duration,
                totalMarks: exam.totalMarks,
                status: exam.status,
                room: index % 3 === 0 ? "Hall A" : index % 3 === 1 ? "Hall B" : "Lab 1",
            })),
        };
    }
    async getStudentResults(userId, page = 1, pageSize = 10) {
        const student = await this.getStudentByUserId(userId);
        const skip = (page - 1) * pageSize;
        const total = await db.examResult.count({
            where: { studentId: student.id },
        });
        const rows = await db.examResult.findMany({
            where: { studentId: student.id },
            include: {
                exam: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                exam: {
                    date: "desc",
                },
            },
            skip,
            take: pageSize,
        });
        const allMarks = student.examResults.map((r) => r.marksObtained);
        const average = allMarks.length ? Math.round(allMarks.reduce((sum, mark) => sum + mark, 0) / allMarks.length) : 0;
        const highest = allMarks.length ? Math.max(...allMarks) : 0;
        const lowest = allMarks.length ? Math.min(...allMarks) : 0;
        return {
            results: rows.map((row) => ({
                id: row.id,
                examId: row.examId,
                examName: row.exam.name,
                subject: row.exam.subject.name,
                examDate: row.exam.date,
                marksObtained: row.marksObtained,
                totalMarks: row.exam.totalMarks,
                percentage: row.exam.totalMarks ? Math.round((row.marksObtained / row.exam.totalMarks) * 100) : 0,
                grade: row.grade || this.getLetterGrade((row.marksObtained / row.exam.totalMarks) * 100),
                remarks: row.remarks,
            })),
            summary: {
                average,
                highest,
                lowest,
                overallGrade: student.grade || this.getLetterGrade(average),
            },
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    async getStudentFees(userId, status = "ALL", page = 1, pageSize = 20) {
        const student = await this.getStudentByUserId(userId);
        const payments = await db.feePayment.findMany({
            where: {
                studentId: student.id,
            },
            include: {
                feeStructure: true,
            },
            orderBy: {
                paymentDate: "desc",
            },
        });
        const mapped = payments.map((payment) => {
            const paymentStatus = payment.status === "PAID" ? "PAID" : "PENDING";
            const period = payment.paymentDate
                ? payment.paymentDate.toLocaleString("en-US", { month: "long", year: "numeric" })
                : "Pending Period";
            return {
                id: payment.id,
                feeType: payment.feeStructure.feeType,
                period,
                amount: payment.feeStructure.amount,
                paidAmount: payment.amountPaid,
                dueDate: payment.paymentDate,
                status: paymentStatus,
                receiptUrl: payment.receiptUrl,
            };
        });
        const today = new Date();
        const filtered = mapped.filter((item) => {
            if (status === "ALL")
                return true;
            if (status === "PAID")
                return item.status === "PAID";
            if (status === "PENDING")
                return item.status === "PENDING";
            if (status === "OVERDUE")
                return item.status === "PENDING" && !!item.dueDate && item.dueDate < today;
            return true;
        });
        const skip = (page - 1) * pageSize;
        const records = filtered.slice(skip, skip + pageSize);
        const totalPaid = mapped
            .filter((m) => m.status === "PAID")
            .reduce((sum, m) => sum + (m.paidAmount || 0), 0);
        const pendingAmount = mapped
            .filter((m) => m.status === "PENDING")
            .reduce((sum, m) => sum + Math.max((m.amount || 0) - (m.paidAmount || 0), 0), 0);
        return {
            summary: {
                totalPaid,
                pendingAmount,
                totalRecords: mapped.length,
            },
            records,
            pagination: {
                total: filtered.length,
                page,
                pageSize,
                totalPages: Math.ceil(filtered.length / pageSize),
            },
        };
    }
    async getStudentNotices(page = 1, pageSize = 10, category, sortBy = "recent") {
        const [pinned, list] = await Promise.all([
            noticeService.getPinnedNotices(5),
            noticeService.getAllNotices(page, pageSize, category, sortBy),
        ]);
        return {
            pinned,
            list,
        };
    }
    async createStudentNotice(userId, input) {
        await this.getStudentByUserId(userId);
        return noticeService.createNotice(input, userId);
    }
}
export const studentDashboardService = new StudentDashboardService();
//# sourceMappingURL=student-dashboard.service.js.map