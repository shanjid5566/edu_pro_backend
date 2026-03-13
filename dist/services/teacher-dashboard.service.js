import { db } from "../config/database.config.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { attendanceService } from "./attendance.service.js";
import { examService } from "./exam.service.js";
import { noticeService } from "./notice.service.js";
export class TeacherDashboardService {
    getMonthLabel(date) {
        return date.toLocaleString("en-US", { month: "short" });
    }
    async getTeacherByUserId(userId) {
        const teacher = await db.teacher.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                classes: {
                    include: {
                        class: {
                            include: {
                                students: {
                                    select: {
                                        id: true,
                                    },
                                },
                                subjects: {
                                    include: {
                                        subject: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!teacher) {
            throw new NotFoundError("Teacher profile not found for this user");
        }
        return teacher;
    }
    async getTeacherDashboard(userId) {
        const teacher = await this.getTeacherByUserId(userId);
        const classIds = teacher.classes.map((tc) => tc.classId);
        const totalStudents = classIds.length
            ? await db.student.count({ where: { classId: { in: classIds } } })
            : 0;
        const examResults = classIds.length
            ? await db.examResult.findMany({
                where: {
                    exam: {
                        classId: { in: classIds },
                    },
                },
                select: {
                    marksObtained: true,
                },
            })
            : [];
        const avgPerformance = examResults.length
            ? Math.round(examResults.reduce((sum, r) => sum + r.marksObtained, 0) /
                examResults.length)
            : 0;
        const classAttendance = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const records = classIds.length
                ? await db.attendance.findMany({
                    where: {
                        classId: { in: classIds },
                        date: {
                            gte: start,
                            lte: end,
                        },
                    },
                    select: {
                        status: true,
                    },
                })
                : [];
            const present = records.filter((a) => a.status === "PRESENT").length;
            const percentage = records.length > 0 ? Math.round((present / records.length) * 100) : 0;
            classAttendance.push({
                month: this.getMonthLabel(start),
                percentage,
            });
        }
        const subjectPerformance = await Promise.all(teacher.subjects.map(async (teacherSubject) => {
            const scores = classIds.length
                ? await db.examResult.findMany({
                    where: {
                        exam: {
                            classId: { in: classIds },
                            subjectId: teacherSubject.subject.id,
                        },
                    },
                    select: {
                        marksObtained: true,
                    },
                })
                : [];
            const avg = scores.length
                ? Math.round(scores.reduce((sum, r) => sum + r.marksObtained, 0) /
                    scores.length)
                : 0;
            return {
                subject: teacherSubject.subject.name,
                percentage: Math.max(0, Math.min(100, avg)),
            };
        }));
        return {
            title: "Teacher Dashboard",
            subtitle: `Welcome back, ${teacher.user.name}! Here's your overview.`,
            stats: {
                myClasses: classIds.length,
                totalStudents,
                classesTaken: teacher.classesTaken,
                avgPerformance,
            },
            charts: {
                classAttendance,
                studentPerformance: subjectPerformance,
            },
        };
    }
    async getTeacherClasses(userId) {
        const teacher = await this.getTeacherByUserId(userId);
        const classes = teacher.classes.map((tc) => ({
            classId: tc.classId,
            className: tc.class.name,
            section: tc.class.section,
            subjects: tc.class.subjects.map((cs) => cs.subject.name),
            studentCount: tc.class.students.length,
        }));
        return {
            classes,
            total: classes.length,
        };
    }
    async getTeacherSchedule(userId, date) {
        const teacher = await this.getTeacherByUserId(userId);
        const selectedDate = date ?? new Date();
        const slots = ["8:00", "9:00", "10:00", "11:00", "1:00"];
        const classSubjectPairs = [];
        teacher.classes.forEach((tc, index) => {
            const subjects = tc.class.subjects.length
                ? tc.class.subjects.map((cs) => cs.subject.name)
                : ["General"];
            subjects.forEach((subjectName) => {
                classSubjectPairs.push({
                    classId: tc.classId,
                    className: tc.class.name,
                    section: tc.class.section,
                    subjectName,
                    studentCount: tc.class.students.length,
                    room: `Room ${201 + index}`,
                });
            });
        });
        const schedule = classSubjectPairs.slice(0, slots.length).map((item, index) => ({
            time: slots[index],
            classId: item.classId,
            className: item.className,
            section: item.section,
            subject: item.subjectName,
            room: item.room,
            studentCount: item.studentCount,
        }));
        return {
            date: selectedDate,
            schedule,
        };
    }
    async getTeacherAttendanceSheet(userId, classId, date) {
        const teacher = await this.getTeacherByUserId(userId);
        const isAssigned = teacher.classes.some((tc) => tc.classId === classId);
        if (!isAssigned) {
            throw new BadRequestError("You are not assigned to this class");
        }
        const selectedDate = date ? new Date(date) : new Date();
        selectedDate.setHours(0, 0, 0, 0);
        const classData = await db.class.findUnique({
            where: { id: classId },
            include: {
                students: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        rollNumber: "asc",
                    },
                },
            },
        });
        if (!classData) {
            throw new NotFoundError("Class not found");
        }
        const attendance = await db.attendance.findMany({
            where: {
                classId,
                date: selectedDate,
            },
            select: {
                studentId: true,
                status: true,
            },
        });
        const statusMap = new Map(attendance.map((a) => [a.studentId, a.status]));
        const students = classData.students.map((student) => ({
            studentId: student.id,
            name: student.user.name,
            rollNumber: student.rollNumber,
            status: statusMap.get(student.id) ?? null,
        }));
        const present = students.filter((s) => s.status === "PRESENT").length;
        const absent = students.filter((s) => s.status === "ABSENT").length;
        const late = students.filter((s) => s.status === "LATE").length;
        return {
            classId: classData.id,
            className: classData.name,
            section: classData.section,
            date: selectedDate,
            summary: {
                present,
                absent,
                late,
                total: students.length,
            },
            students,
        };
    }
    async saveTeacherAttendanceSheet(userId, classId, date, attendances) {
        const teacher = await this.getTeacherByUserId(userId);
        const isAssigned = teacher.classes.some((tc) => tc.classId === classId);
        if (!isAssigned) {
            throw new BadRequestError("You are not assigned to this class");
        }
        await attendanceService.bulkMarkAttendance({
            classId,
            date,
            attendances,
        }, teacher.id);
        return this.getTeacherAttendanceSheet(userId, classId, date);
    }
    async getTeacherRecentAttendance(userId, limit = 5) {
        const teacher = await this.getTeacherByUserId(userId);
        const records = await db.attendance.findMany({
            where: {
                markedBy: teacher.id,
            },
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        section: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
            take: Math.max(limit * 20, 20),
        });
        const grouped = new Map();
        records.forEach((record) => {
            const day = new Date(record.date);
            day.setHours(0, 0, 0, 0);
            const key = `${record.class.id}_${day.toISOString()}`;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    classId: record.class.id,
                    className: record.class.name,
                    section: record.class.section,
                    date: day,
                    present: 0,
                    absent: 0,
                    late: 0,
                    total: 0,
                });
            }
            const bucket = grouped.get(key);
            bucket.total += 1;
            if (record.status === "PRESENT")
                bucket.present += 1;
            if (record.status === "ABSENT")
                bucket.absent += 1;
            if (record.status === "LATE")
                bucket.late += 1;
        });
        return Array.from(grouped.values())
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }
    async getTeacherExams(userId, page = 1, pageSize = 10, status, classId, subjectId) {
        const teacher = await this.getTeacherByUserId(userId);
        const classIds = teacher.classes.map((tc) => tc.classId);
        const subjectIds = teacher.subjects.map((ts) => ts.subjectId);
        const allowedClassIds = classId ? [classId].filter((id) => classIds.includes(id)) : classIds;
        const allowedSubjectIds = subjectId ? [subjectId].filter((id) => subjectIds.includes(id)) : subjectIds;
        const result = await examService.getExams(page, pageSize, status, allowedClassIds[0] && classId ? classId : undefined, allowedSubjectIds[0] && subjectId ? subjectId : undefined);
        const exams = result.exams.filter((exam) => classIds.includes(exam.classId) && subjectIds.includes(exam.subjectId));
        return {
            exams,
            pagination: result.pagination,
        };
    }
    async createTeacherExam(userId, input) {
        const teacher = await this.getTeacherByUserId(userId);
        const isClassAllowed = teacher.classes.some((tc) => tc.classId === input.classId);
        const isSubjectAllowed = teacher.subjects.some((ts) => ts.subjectId === input.subjectId);
        if (!isClassAllowed || !isSubjectAllowed) {
            throw new BadRequestError("You can create exams only for your assigned classes and subjects");
        }
        return examService.createExam(input);
    }
    async uploadTeacherQuestionPaper(userId, examId, fileUrl) {
        if (!fileUrl || !fileUrl.trim()) {
            throw new BadRequestError("fileUrl is required");
        }
        const teacher = await this.getTeacherByUserId(userId);
        const exam = await db.exam.findUnique({ where: { id: examId } });
        if (!exam) {
            throw new NotFoundError("Exam not found");
        }
        const isClassAllowed = teacher.classes.some((tc) => tc.classId === exam.classId);
        const isSubjectAllowed = teacher.subjects.some((ts) => ts.subjectId === exam.subjectId);
        if (!isClassAllowed || !isSubjectAllowed) {
            throw new BadRequestError("You can upload question papers only for your assigned class-subject exams");
        }
        return db.questionPaper.create({
            data: {
                examId,
                teacherId: teacher.id,
                fileUrl: fileUrl.trim(),
                status: "PENDING",
            },
            include: {
                exam: {
                    include: {
                        class: {
                            select: {
                                name: true,
                                section: true,
                            },
                        },
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getTeacherNotices(page = 1, pageSize = 10, category, sortBy = "recent") {
        const [pinned, list] = await Promise.all([
            noticeService.getPinnedNotices(5),
            noticeService.getAllNotices(page, pageSize, category, sortBy),
        ]);
        return {
            pinned,
            list,
        };
    }
    async createTeacherNotice(userId, input) {
        await this.getTeacherByUserId(userId);
        return noticeService.createNotice(input, userId);
    }
}
export const teacherDashboardService = new TeacherDashboardService();
//# sourceMappingURL=teacher-dashboard.service.js.map