/**
 * Dashboard Service
 * Business logic for dashboard data aggregation and statistics
 */
import { db } from "../config/database.config";
export class DashboardService {
    /**
     * Get complete admin dashboard data
     */
    async getAdminDashboard() {
        const [overview, attendanceTrend, performanceBySubject, todaysAttendance, recentActivity] = await Promise.all([
            this.getDashboardOverview(),
            this.getAttendanceTrend(),
            this.getPerformanceBySubject(),
            this.getTodaysAttendance(),
            this.getRecentActivity(10),
        ]);
        return {
            overview,
            attendanceTrend,
            performanceBySubject,
            todaysAttendance,
            recentActivity,
        };
    }
    /**
     * Get dashboard overview statistics
     */
    async getDashboardOverview() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalStudents, totalTeachers, totalClasses, totalParents] = await Promise.all([
            db.student.count(),
            db.teacher.count(),
            db.class.count(),
            db.parent.count(),
        ]);
        // Get this month's trends
        const studentsThisMonth = await db.student.count({
            where: {
                admissionDate: {
                    gte: firstDayOfMonth,
                },
            },
        });
        const teachersThisMonth = await db.teacher.count({
            where: {
                joinDate: {
                    gte: firstDayOfMonth,
                },
            },
        });
        const classesThisMonth = await db.class.count({
            where: {
            // Assuming classes don't have createdAt, using a default logic
            },
        });
        const parentsThisMonth = await db.parent.count({
            where: {
            // Assuming parents don't have createdAt, using a default logic
            },
        });
        return {
            totalStudents,
            studentsTrendThisMonth: studentsThisMonth,
            totalTeachers,
            teachersTrendThisMonth: teachersThisMonth,
            totalClasses,
            newSectionsThisMonth: classesThisMonth,
            totalParents,
            parentsTrendThisMonth: parentsThisMonth,
        };
    }
    /**
     * Get attendance trend for last 6 months
     */
    async getAttendanceTrend() {
        const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
        const attendanceData = [];
        for (let i = 0; i < months.length; i++) {
            // Mock data - in real scenario, calculate from attendance records
            const percentages = [95, 92, 88, 90, 94, 96];
            attendanceData.push({
                month: months[i],
                percentage: percentages[i],
            });
        }
        return attendanceData;
    }
    /**
     * Get performance by subject
     */
    async getPerformanceBySubject() {
        const subjects = await db.subject.findMany({
            select: {
                id: true,
                name: true,
            },
            take: 10,
        });
        // Mock performance data - in real scenario, calculate from exam results
        const performanceMap = {
            Math: 85,
            Science: 78,
            English: 82,
            History: 75,
            CS: 90,
        };
        return subjects.map((subject) => ({
            subject: subject.name,
            percentage: performanceMap[subject.name] || 80,
        }));
    }
    /**
     * Get today's attendance overview
     */
    async getTodaysAttendance() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendanceRecords = await db.attendance.findMany({
            where: {
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });
        const present = attendanceRecords.filter((a) => a.status === "PRESENT").length;
        const absent = attendanceRecords.filter((a) => a.status === "ABSENT").length;
        const late = attendanceRecords.filter((a) => a.status === "LATE").length;
        const total = attendanceRecords.length || 1; // Avoid division by zero
        return {
            present,
            presentPercentage: Math.round((present / total) * 100),
            absent,
            absentPercentage: Math.round((absent / total) * 100),
            late,
            latePercentage: Math.round((late / total) * 100),
            total,
        };
    }
    /**
     * Get recent activity
     */
    async getRecentActivity(limit = 10) {
        const activities = [];
        // Get recent students
        const recentStudents = await db.student.findMany({
            take: limit,
            orderBy: {
                admissionDate: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                class: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        recentStudents.forEach((student) => {
            activities.push({
                id: `student_${student.id}`,
                type: "student_enrolled",
                title: `New student ${student.user.name} enrolled`,
                description: `in Class ${student.class.name}`,
                timestamp: student.admissionDate,
                relatedUser: {
                    id: student.user.id,
                    name: student.user.name,
                    avatar: student.user.avatar || undefined,
                },
                metadata: {
                    studentId: student.id,
                    studentName: student.user.name,
                    classId: student.class.id,
                    className: student.class.name,
                },
            });
        });
        // Get recent exams
        const recentExams = await db.exam.findMany({
            take: limit,
            orderBy: {
                date: "desc",
            },
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        recentExams.forEach((exam) => {
            activities.push({
                id: `exam_${exam.id}`,
                type: "exam_published",
                title: `Exam results published for ${exam.name}`,
                description: `Class ${exam.class.name}`,
                timestamp: exam.date,
                metadata: {
                    classId: exam.classId,
                    className: exam.class.name,
                },
            });
        });
        // Get recent notices
        const recentNotices = await db.notice.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
        recentNotices.forEach((notice) => {
            activities.push({
                id: `notice_${notice.id}`,
                type: "notice_posted",
                title: notice.title,
                description: notice.message || "Notice posted",
                timestamp: notice.createdAt,
                relatedUser: {
                    id: notice.author.id,
                    name: notice.author.name,
                    avatar: notice.author.avatar || undefined,
                },
            });
        });
        // Sort by timestamp and return top items
        return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
    }
    /**
     * Get class statistics
     */
    async getClassStatistics(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [classes, total] = await Promise.all([
            db.class.findMany({
                skip,
                take: pageSize,
                include: {
                    students: {
                        select: {
                            id: true,
                        },
                    },
                    attendances: {
                        where: {
                            date: {
                                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            },
                        },
                        select: {
                            status: true,
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            }),
            db.class.count(),
        ]);
        const data = classes.map((classData) => {
            const todayAttendance = classData.attendances;
            const present = todayAttendance.filter((a) => a.status === "PRESENT").length;
            const absent = todayAttendance.filter((a) => a.status === "ABSENT").length;
            const late = todayAttendance.filter((a) => a.status === "LATE").length;
            const totalNotified = todayAttendance.length || 1;
            return {
                classId: classData.id,
                className: classData.name,
                section: classData.section,
                totalStudents: classData.students.length,
                presentToday: present,
                absentToday: absent,
                lateToday: late,
                averageAttendance: Math.round((present / Math.max(classData.students.length, 1)) * 100),
            };
        });
        return {
            data,
            total,
        };
    }
    /**
     * Get teacher performance
     */
    async getTeacherPerformance(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [teachers, total] = await Promise.all([
            db.teacher.findMany({
                skip,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    classes: {
                        select: {
                            id: true,
                        },
                    },
                    subjects: {
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: {
                    user: {
                        name: "asc",
                    },
                },
            }),
            db.teacher.count(),
        ]);
        const data = teachers.map((teacher) => ({
            teacherId: teacher.id,
            teacherName: teacher.user.name,
            department: teacher.department,
            totalClasses: teacher.classes.length,
            totalSubjects: teacher.subjects.length,
            averageAttendance: 92, // Mock data
            classesConducated: teacher.classesTaken,
        }));
        return {
            data,
            total,
        };
    }
    /**
     * Get student performance
     */
    async getStudentPerformance(page = 1, pageSize = 10, classId) {
        const skip = (page - 1) * pageSize;
        const whereCondition = {};
        if (classId) {
            whereCondition.classId = classId;
        }
        const [students, total] = await Promise.all([
            db.student.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    class: {
                        select: {
                            name: true,
                            section: true,
                        },
                    },
                    examResults: {
                        select: {
                            marksObtained: true,
                            grade: true,
                        },
                    },
                    attendances: {
                        select: {
                            status: true,
                        },
                    },
                },
                orderBy: {
                    user: {
                        name: "asc",
                    },
                },
            }),
            db.student.count({ where: whereCondition }),
        ]);
        const data = students.map((student) => {
            // Calculate average grade
            let averageGrade = "N/A";
            let totalMarks = 0;
            if (student.examResults.length > 0) {
                const avgScore = student.examResults.reduce((sum, r) => sum + r.marksObtained, 0) / student.examResults.length;
                if (avgScore >= 90)
                    averageGrade = "A";
                else if (avgScore >= 80)
                    averageGrade = "B";
                else if (avgScore >= 70)
                    averageGrade = "C";
                else if (avgScore >= 60)
                    averageGrade = "D";
                else
                    averageGrade = "F";
                totalMarks = Math.round(avgScore);
            }
            // Calculate attendance
            const presentDays = student.attendances.filter((a) => a.status === "PRESENT").length;
            const attendance = Math.round((presentDays / Math.max(student.attendances.length, 1)) * 100);
            // Determine performance level
            let performance = "average";
            if (totalMarks >= 85 && attendance >= 90)
                performance = "excellent";
            else if (totalMarks >= 75 && attendance >= 80)
                performance = "good";
            else if (totalMarks >= 60 && attendance >= 70)
                performance = "average";
            else
                performance = "poor";
            return {
                studentId: student.id,
                studentName: student.user.name,
                className: student.class.name,
                section: student.class.section,
                rollNumber: student.rollNumber,
                attendance,
                averageGrade,
                performance,
            };
        });
        return {
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    /**
     * Get fee collection summary
     */
    async getFeeCollectionSummary() {
        const feePayments = await db.feePayment.findMany({
            select: {
                amountPaid: true,
                status: true,
            },
        });
        const feeStructures = await db.feeStructure.findMany({
            select: {
                amount: true,
            },
        });
        const totalStudents = await db.student.count();
        const totalExpected = totalStudents * (feeStructures[0]?.amount || 0);
        const totalCollected = feePayments
            .filter((p) => p.status === "PAID")
            .reduce((sum, p) => sum + p.amountPaid, 0);
        const totalPending = totalExpected - totalCollected;
        return {
            totalExpected,
            totalCollected,
            totalPending,
            collectionPercentage: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0,
            pendingAmount: totalPending,
        };
    }
    /**
     * Get exam summary
     */
    async getExamSummary() {
        const now = new Date();
        const [totalExams, upcomingExams, completedExams] = await Promise.all([
            db.exam.count(),
            db.exam.count({
                where: {
                    date: {
                        gt: now,
                    },
                },
            }),
            db.exam.count({
                where: {
                    date: {
                        lte: now,
                    },
                },
            }),
        ]);
        // Mock average score
        const averageScore = 78;
        return {
            totalExams,
            upcomingExams,
            completedExams,
            averageScore,
        };
    }
}
export const dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map