import { prisma } from "../lib/prisma.js";

class ParentChildFeesService {
  private async resolveParentId(userId: string): Promise<string> {
    const parent = await prisma.parent.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!parent) {
      throw new Error("Parent not found");
    }

    return parent.id;
  }

  private async resolveAuthorizedStudentId(
    parentId: string,
    studentOrEnrollmentId: string
  ): Promise<string> {
    const relation = await prisma.parentStudent.findFirst({
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

  // Get all fees for child
  async getAllFees(userId: string, studentId: string, limit: number = 50, offset: number = 0) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const fees = await (prisma as any).feePayment.findMany({
        where: { studentId: resolvedStudentId },
        include: {
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
        },
        orderBy: [{ paymentDate: "desc" }, { id: "desc" }],
        take: limit,
        skip: offset,
      });

      const total = await (prisma as any).feePayment.count({ where: { studentId: resolvedStudentId } });

      return {
        success: true,
        data: fees.map((fee: any) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.amountPaid,
          status: fee.status,
          paymentDate: fee.paymentDate ? fee.paymentDate.toISOString().split("T")[0] : null,
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error("Error fetching all fees:", error);
      throw error;
    }
  }

  // Get fee summary
  async getFeeSummary(userId: string, studentId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const fees = await (prisma as any).feePayment.findMany({
        where: { studentId: resolvedStudentId },
        select: {
          amountPaid: true,
          status: true,
        },
      });

      let totalPaid = 0;
      let totalPending = 0;
      let totalUnpaid = 0;
      const totalRecords = fees.length;

      fees.forEach((fee: any) => {
        if (fee.status === "PAID") {
          totalPaid += fee.amountPaid;
        } else if (fee.status === "UNPAID") {
          totalUnpaid += fee.amountPaid;
        } else if (fee.status === "PARTIAL") {
          totalPending += fee.amountPaid;
        }
      });

      return {
        success: true,
        data: {
          totalPaid,
          totalPending: totalPending + totalUnpaid,
          totalRecords,
          totalPayable: totalPaid + totalPending + totalUnpaid,
          pendingAmount: totalPending + totalUnpaid,
        },
      };
    } catch (error) {
      console.error("Error fetching fee summary:", error);
      throw error;
    }
  }

  // Get fees by status
  async getFeesByStatus(userId: string, studentId: string, status: string, limit: number = 50, offset: number = 0) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const validStatus = ["PAID", "UNPAID", "PARTIAL"];
      if (!validStatus.includes(status.toUpperCase())) {
        throw new Error("Invalid status. Must be PAID, UNPAID, or PARTIAL");
      }

      const fees = await (prisma as any).feePayment.findMany({
        where: {
          studentId: resolvedStudentId,
          status: status.toUpperCase() as "PAID" | "UNPAID" | "PARTIAL",
        },
        include: {
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
        },
        orderBy: [{ paymentDate: "desc" }, { id: "desc" }],
        take: limit,
        skip: offset,
      });

      const total = await (prisma as any).feePayment.count({
        where: {
          studentId: resolvedStudentId,
          status: status.toUpperCase() as "PAID" | "UNPAID" | "PARTIAL",
        },
      });

      return {
        success: true,
        data: fees.map((fee: any) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.amountPaid,
          status: fee.status,
          paymentDate: fee.paymentDate ? fee.paymentDate.toISOString().split("T")[0] : null,
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error("Error fetching fees by status:", error);
      throw error;
    }
  }

  // Get fees by type
  async getFeesByType(userId: string, studentId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const fees = await (prisma as any).feePayment.findMany({
        where: { studentId: resolvedStudentId },
        include: {
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

      fees.forEach((fee: any) => {
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
          feeTypeMap[feeType].unpaid += fee.amountPaid;
        } else if (fee.status === "PARTIAL") {
          feeTypeMap[feeType].partial += fee.amountPaid;
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

  // Get upcoming fees
  async getUpcomingFees(userId: string, studentId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const upcomingFees = await (prisma as any).feePayment.findMany({
        where: {
          studentId: resolvedStudentId,
          status: "UNPAID",
        },
        include: {
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
        },
        orderBy: { id: "asc" },
        take: 10,
      });

      return {
        success: true,
        data: upcomingFees.map((fee: any) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.feeStructure.amount,
          status: fee.status,
        })),
      };
    } catch (error) {
      console.error("Error fetching upcoming fees:", error);
      throw error;
    }
  }

  // Get overdue fees
  async getOverdueFees(userId: string, studentId: string) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const overdueFees = await (prisma as any).feePayment.findMany({
        where: {
          studentId: resolvedStudentId,
          status: "UNPAID",
        },
        include: {
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });

      let totalOverdue = 0;
      overdueFees.forEach((fee: any) => {
        totalOverdue += fee.feeStructure.amount;
      });

      return {
        success: true,
        data: {
          totalOverdue,
          count: overdueFees.length,
          fees: overdueFees.map((fee: any) => ({
            id: fee.id,
            feeType: fee.feeStructure.feeType,
            amount: fee.feeStructure.amount,
            status: fee.status,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching overdue fees:", error);
      throw error;
    }
  }

  // Get paid fees timeline (receipt history)
  async getFeesTimeline(userId: string, studentId: string, limit: number = 10) {
    try {
      const parentId = await this.resolveParentId(userId);
      const resolvedStudentId = await this.resolveAuthorizedStudentId(
        parentId,
        studentId
      );

      const paidFees = await (prisma as any).feePayment.findMany({
        where: {
          studentId: resolvedStudentId,
          status: "PAID",
          paymentDate: { not: null },
        },
        include: {
          feeStructure: {
            select: {
              feeType: true,
              amount: true,
            },
          },
        },
        orderBy: { paymentDate: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: paidFees.map((fee: any) => ({
          id: fee.id,
          feeType: fee.feeStructure.feeType,
          amount: fee.amountPaid,
          paymentDate: fee.paymentDate!.toISOString().split("T")[0],
          paymentStatus: "PAID",
        })),
      };
    } catch (error) {
      console.error("Error fetching fees timeline:", error);
      throw error;
    }
  }
}

export default new ParentChildFeesService();
