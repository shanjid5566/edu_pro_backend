import { prisma } from "../lib/prisma.js";

class StudentFeesService {
  // Get all fees
  async getAllFees(studentId: string) {
    try {
      const feePayments = await prisma.feePayment.findMany({
        where: { studentId },
        select: {
          id: true,
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
          amountPaid: true,
          paymentDate: true,
          status: true,
        },
        orderBy: { paymentDate: "desc" },
      });

      return {
        success: true,
        data: feePayments.map((fee) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.feeStructure.amount,
          amountPaid: fee.amountPaid,
          paymentDate: fee.paymentDate
            ? fee.paymentDate.toISOString().split("T")[0]
            : null,
          status: fee.status,
        })),
      };
    } catch (error) {
      console.error("Error fetching all fees:", error);
      throw error;
    }
  }

  // Get fees by status
  async getFeesByStatus(studentId: string, status: string) {
    try {
      const validStatus = ["PAID", "UNPAID", "PARTIAL"];
      if (!validStatus.includes(status.toUpperCase())) {
        throw new Error("Invalid status. Must be PAID, UNPAID, or PARTIAL");
      }

      const feePayments = await prisma.feePayment.findMany({
        where: {
          studentId,
          status: status.toUpperCase() as "PAID" | "UNPAID" | "PARTIAL",
        },
        select: {
          id: true,
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
          amountPaid: true,
          paymentDate: true,
          status: true,
        },
        orderBy: { paymentDate: "desc" },
      });

      return {
        success: true,
        data: feePayments.map((fee) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.feeStructure.amount,
          amountPaid: fee.amountPaid,
          paymentDate: fee.paymentDate
            ? fee.paymentDate.toISOString().split("T")[0]
            : null,
          status: fee.status,
        })),
      };
    } catch (error) {
      console.error("Error fetching fees by status:", error);
      throw error;
    }
  }

  // Get fee summary
  async getFeeSummary(studentId: string) {
    try {
      const feePayments = await prisma.feePayment.findMany({
        where: { studentId },
        select: {
          status: true,
          amountPaid: true,
          feeStructure: {
            select: {
              amount: true,
            },
          },
        },
      });

      let totalPaid = 0;
      let totalUnpaid = 0;
      let totalPartial = 0;

      feePayments.forEach((fee) => {
        if (fee.status === "PAID") {
          totalPaid += fee.amountPaid;
        } else if (fee.status === "UNPAID") {
          totalUnpaid += fee.feeStructure.amount;
        } else if (fee.status === "PARTIAL") {
          totalPartial += fee.feeStructure.amount - fee.amountPaid;
        }
      });

      return {
        success: true,
        data: {
          totalPaid,
          totalUnpaid,
          totalPartial,
          totalRecords: feePayments.length,
          totalPayable: totalPaid + totalUnpaid + totalPartial,
          pendingAmount: totalUnpaid + totalPartial,
        },
      };
    } catch (error) {
      console.error("Error fetching fee summary:", error);
      throw error;
    }
  }

  // Get fees by type
  async getFeesByType(studentId: string) {
    try {
      const feePayments = await prisma.feePayment.findMany({
        where: { studentId },
        select: {
          status: true,
          amountPaid: true,
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
        },
      });

      const feeTypeMap: Record<
        string,
        {
          paid: number;
          unpaid: number;
          partial: number;
          total: number;
        }
      > = {};

      feePayments.forEach((fee) => {
        const feeType = fee.feeStructure.feeType;
        if (!feeTypeMap[feeType]) {
          feeTypeMap[feeType] = {
            paid: 0,
            unpaid: 0,
            partial: 0,
            total: 0,
          };
        }

        feeTypeMap[feeType].total += fee.feeStructure.amount;

        if (fee.status === "PAID") {
          feeTypeMap[feeType].paid += fee.amountPaid;
        } else if (fee.status === "UNPAID") {
          feeTypeMap[feeType].unpaid += fee.feeStructure.amount;
        } else if (fee.status === "PARTIAL") {
          feeTypeMap[feeType].partial += fee.feeStructure.amount - fee.amountPaid;
        }
      });

      return {
        success: true,
        data: Object.entries(feeTypeMap).map(([feeType, amounts]) => ({
          feeType,
          paid: amounts.paid,
          unpaid: amounts.unpaid,
          partial: amounts.partial,
          total: amounts.total,
        })),
      };
    } catch (error) {
      console.error("Error fetching fees by type:", error);
      throw error;
    }
  }

  // Get fee timeline (paid fees with receipts)
  async getFeeTimeline(studentId: string, limit: number = 10) {
    try {
      const paidFees = await prisma.feePayment.findMany({
        where: {
          studentId,
          status: "PAID",
          paymentDate: { not: null },
        },
        select: {
          id: true,
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
          amountPaid: true,
          paymentDate: true,
          receiptUrl: true,
        },
        orderBy: { paymentDate: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: paidFees.map((fee) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.feeStructure.amount,
          amountPaid: fee.amountPaid,
          paymentDate: fee.paymentDate!.toISOString().split("T")[0],
          paymentStatus: "PAID",
          receiptUrl: fee.receiptUrl,
        })),
      };
    } catch (error) {
      console.error("Error fetching fee timeline:", error);
      throw error;
    }
  }

  // Get pending fees
  async getPendingFees(studentId: string) {
    try {
      const pendingFees = await prisma.feePayment.findMany({
        where: {
          studentId,
          status: { in: ["UNPAID", "PARTIAL"] },
        },
        select: {
          id: true,
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
          amountPaid: true,
          status: true,
        },
      });

      return {
        success: true,
        data: pendingFees.map((fee) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.feeStructure.amount,
          amountPaid: fee.amountPaid,
          amountDue:
            fee.status === "PARTIAL"
              ? fee.feeStructure.amount - fee.amountPaid
              : fee.feeStructure.amount,
          status: fee.status,
        })),
      };
    } catch (error) {
      console.error("Error fetching pending fees:", error);
      throw error;
    }
  }

  // Get paid fees
  async getPaidFees(studentId: string) {
    try {
      const paidFees = await prisma.feePayment.findMany({
        where: {
          studentId,
          status: "PAID",
        },
        select: {
          id: true,
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
          amountPaid: true,
          paymentDate: true,
        },
        orderBy: { paymentDate: "desc" },
      });

      let totalPaid = 0;
      paidFees.forEach((fee) => {
        totalPaid += fee.amountPaid;
      });

      return {
        success: true,
        data: {
          totalPaid,
          count: paidFees.length,
          fees: paidFees.map((fee) => ({
            id: fee.id,
            feeType: fee.feeStructure.feeType,
            amount: fee.feeStructure.amount,
            amountPaid: fee.amountPaid,
            paymentDate: fee.paymentDate
              ? fee.paymentDate.toISOString().split("T")[0]
              : null,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching paid fees:", error);
      throw error;
    }
  }
}

export default new StudentFeesService();
