"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
class StudentFeesService {
    // Get all fees
    async getAllFees(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                    classId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const fees = await prisma_js_1.prisma.fee.findMany({
                where: { enrollmentId: student.enrollmentId },
                select: {
                    id: true,
                    feeType: true,
                    period: true,
                    amount: true,
                    dueDate: true,
                    paidDate: true,
                    status: true,
                    feeCategoryId: true,
                },
                orderBy: { dueDate: "desc" },
            });
            return {
                success: true,
                data: fees.map((fee) => ({
                    id: fee.id,
                    feeType: fee.feeType,
                    period: fee.period,
                    amount: fee.amount,
                    dueDate: fee.dueDate.toISOString().split("T")[0],
                    paidDate: fee.paidDate
                        ? fee.paidDate.toISOString().split("T")[0]
                        : null,
                    status: fee.status,
                    daysRemaining: fee.status === "PENDING"
                        ? Math.ceil((fee.dueDate.getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24))
                        : null,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching all fees:", error);
            throw error;
        }
    }
    // Get fees by status
    async getFeesByStatus(studentId, status) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const validStatus = ["PAID", "PENDING", "OVERDUE"];
            if (!validStatus.includes(status.toUpperCase())) {
                throw new Error("Invalid status. Must be PAID, PENDING, or OVERDUE");
            }
            const fees = await prisma_js_1.prisma.fee.findMany({
                where: {
                    enrollmentId: student.enrollmentId,
                    status: status.toUpperCase(),
                },
                select: {
                    id: true,
                    feeType: true,
                    period: true,
                    amount: true,
                    dueDate: true,
                    paidDate: true,
                    status: true,
                },
                orderBy: { dueDate: "desc" },
            });
            return {
                success: true,
                data: fees.map((fee) => ({
                    id: fee.id,
                    feeType: fee.feeType,
                    period: fee.period,
                    amount: fee.amount,
                    dueDate: fee.dueDate.toISOString().split("T")[0],
                    paidDate: fee.paidDate
                        ? fee.paidDate.toISOString().split("T")[0]
                        : null,
                    status: fee.status,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching fees by status:", error);
            throw error;
        }
    }
    // Get fee summary
    async getFeeSummary(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const fees = await prisma_js_1.prisma.fee.findMany({
                where: { enrollmentId: student.enrollmentId },
                select: {
                    amount: true,
                    status: true,
                },
            });
            let totalPaid = 0;
            let totalPending = 0;
            let totalOverdue = 0;
            const totalRecords = fees.length;
            fees.forEach((fee) => {
                if (fee.status === "PAID") {
                    totalPaid += fee.amount;
                }
                else if (fee.status === "PENDING") {
                    totalPending += fee.amount;
                }
                else if (fee.status === "OVERDUE") {
                    totalOverdue += fee.amount;
                }
            });
            return {
                success: true,
                data: {
                    totalPaid,
                    totalPending,
                    totalOverdue,
                    totalRecords,
                    totalPayable: totalPaid + totalPending + totalOverdue,
                    pendingAmount: totalPending + totalOverdue,
                },
            };
        }
        catch (error) {
            console.error("Error fetching fee summary:", error);
            throw error;
        }
    }
    // Get fees by type
    async getFeesByType(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const fees = await prisma_js_1.prisma.fee.findMany({
                where: { enrollmentId: student.enrollmentId },
                select: {
                    feeType: true,
                    amount: true,
                    status: true,
                },
            });
            const feeTypeMap = {};
            fees.forEach((fee) => {
                if (!feeTypeMap[fee.feeType]) {
                    feeTypeMap[fee.feeType] = {
                        paid: 0,
                        pending: 0,
                        overdue: 0,
                        total: 0,
                    };
                }
                feeTypeMap[fee.feeType].total += fee.amount;
                if (fee.status === "PAID") {
                    feeTypeMap[fee.feeType].paid += fee.amount;
                }
                else if (fee.status === "PENDING") {
                    feeTypeMap[fee.feeType].pending += fee.amount;
                }
                else if (fee.status === "OVERDUE") {
                    feeTypeMap[fee.feeType].overdue += fee.amount;
                }
            });
            return {
                success: true,
                data: Object.entries(feeTypeMap).map(([feeType, amounts]) => ({
                    feeType,
                    paid: amounts.paid,
                    pending: amounts.pending,
                    overdue: amounts.overdue,
                    total: amounts.total,
                })),
            };
        }
        catch (error) {
            console.error("Error fetching fees by type:", error);
            throw error;
        }
    }
    // Get fee timeline (paid fees with receipts)
    async getFeeTimeline(studentId, limit = 10) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const paidFees = await prisma_js_1.prisma.fee.findMany({
                where: {
                    enrollmentId: student.enrollmentId,
                    status: "PAID",
                    paidDate: { not: null },
                },
                select: {
                    id: true,
                    feeType: true,
                    period: true,
                    amount: true,
                    paidDate: true,
                    dueDate: true,
                },
                orderBy: { paidDate: "desc" },
                take: limit,
            });
            return {
                success: true,
                data: paidFees.map((fee) => ({
                    id: fee.id,
                    feeType: fee.feeType,
                    period: fee.period,
                    amount: fee.amount,
                    paidDate: fee.paidDate.toISOString().split("T")[0],
                    dueDate: fee.dueDate.toISOString().split("T")[0],
                    paymentStatus: "PAID",
                })),
            };
        }
        catch (error) {
            console.error("Error fetching fee timeline:", error);
            throw error;
        }
    }
    // Get upcoming fees
    async getUpcomingFees(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const today = new Date();
            const upcomingFees = await prisma_js_1.prisma.fee.findMany({
                where: {
                    enrollmentId: student.enrollmentId,
                    status: "PENDING",
                    dueDate: { gte: today },
                },
                select: {
                    id: true,
                    feeType: true,
                    period: true,
                    amount: true,
                    dueDate: true,
                },
                orderBy: { dueDate: "asc" },
            });
            return {
                success: true,
                data: upcomingFees.map((fee) => ({
                    id: fee.id,
                    feeType: fee.feeType,
                    period: fee.period,
                    amount: fee.amount,
                    dueDate: fee.dueDate.toISOString().split("T")[0],
                    daysRemaining: Math.ceil((fee.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
                })),
            };
        }
        catch (error) {
            console.error("Error fetching upcoming fees:", error);
            throw error;
        }
    }
    // Get overdue fees
    async getOverdueFees(studentId) {
        try {
            const student = await prisma_js_1.prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    enrollmentId: true,
                },
            });
            if (!student) {
                throw new Error("Student not found");
            }
            const overdueFees = await prisma_js_1.prisma.fee.findMany({
                where: {
                    enrollmentId: student.enrollmentId,
                    status: "OVERDUE",
                },
                select: {
                    id: true,
                    feeType: true,
                    period: true,
                    amount: true,
                    dueDate: true,
                },
                orderBy: { dueDate: "asc" },
            });
            let totalOverdue = 0;
            overdueFees.forEach((fee) => {
                totalOverdue += fee.amount;
            });
            return {
                success: true,
                data: {
                    totalOverdue,
                    count: overdueFees.length,
                    fees: overdueFees.map((fee) => ({
                        id: fee.id,
                        feeType: fee.feeType,
                        period: fee.period,
                        amount: fee.amount,
                        dueDate: fee.dueDate.toISOString().split("T")[0],
                        daysOverdue: Math.ceil((new Date().getTime() - fee.dueDate.getTime()) /
                            (1000 * 60 * 60 * 24)),
                    })),
                },
            };
        }
        catch (error) {
            console.error("Error fetching overdue fees:", error);
            throw error;
        }
    }
}
exports.default = new StudentFeesService();
