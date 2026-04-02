import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs";

interface CreateParentPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  occupation: string;
  studentIds?: string[];
}

interface UpdateParentPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  studentIds?: string[];
}

interface ParentListOptions {
  skip: number;
  take: number;
  search?: string;
  occupation?: string;
  status?: string;
}

class AdminParentService {
  private async findParentByIdentifier(parentIdentifier: string) {
    return prisma.parent.findFirst({
      where: {
        OR: [{ id: parentIdentifier }, { userId: parentIdentifier }],
      },
      include: {
        user: true,
        students: {
          include: {
            student: {
              include: {
                user: true,
                class: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get all parents with pagination and filters
   */
  async getAllParents(options: ParentListOptions) {
    try {
      const { skip, take, search, occupation, status } = options;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ];
      }

      if (occupation) {
        where.occupation = occupation;
      }

      if (status) {
        where.user = { ...where.user, status };
      }

      const [parents, total] = await Promise.all([
        prisma.parent.findMany({
          where,
          select: {
            id: true,
            occupation: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
              },
            },
            students: {
              select: {
                student: {
                  select: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          skip,
          take,
          orderBy: { user: { name: "asc" } },
        }),
        prisma.parent.count({ where }),
      ]);

      const parentsData = parents.map((parent) => ({
        id: parent.id,
        name: parent.user.name,
        email: parent.user.email,
        phone: parent.user.phone,
        occupation: parent.occupation || "N/A",
        childrenCount: parent.students.length,
        children: parent.students.map((s) => s.student.user.name).join(", "),
        status: parent.user.status,
      }));

      return {
        success: true,
        data: parentsData,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch parents");
    }
  }

  /**
   * Get parent profile by ID
   */
  async getParentById(parentIdentifier: string) {
    try {
      const parent = await this.findParentByIdentifier(parentIdentifier);

      if (!parent) {
        return {
          success: false,
          message: "Parent not found",
        };
      }

      return {
        success: true,
        data: {
          id: parent.id,
          name: parent.user.name,
          email: parent.user.email,
          phone: parent.user.phone,
          occupation: parent.occupation,
          status: parent.user.status,
          children: parent.students.map((s) => ({
            id: s.student.id,
            name: s.student.user.name,
            email: s.student.user.email,
            class: s.student.class.name,
            rollNumber: s.student.rollNumber,
          })),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch parent details");
    }
  }

  /**
   * Create new parent
   */
  async createParent(payload: CreateParentPayload) {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: "Email already exists",
        };
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(payload.password, 10);

      // Create user first
      const user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.fullName,
          phone: payload.phone,
          password: hashedPassword,
          role: "PARENT",
          status: "active",
        },
      });

      // Create parent record
      const parent = await prisma.parent.create({
        data: {
          userId: user.id,
          occupation: payload.occupation,
        },
      });

      // Link students to parent if provided
      if (payload.studentIds && payload.studentIds.length > 0) {
        try {
          await Promise.all(
            payload.studentIds.map((studentId) =>
              prisma.parentStudent.create({
                data: {
                  parentId: parent.id,
                  studentId,
                },
              })
            )
          );
        } catch (error) {
          console.log("Warning: Failed to link students - IDs may not exist");
        }
      }

      return {
        success: true,
        message: "Parent created successfully",
        data: {
          id: parent.id,
          name: payload.fullName,
          email: payload.email,
          password: payload.password,
          occupation: payload.occupation,
        },
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Email already exists",
        };
      }
      throw new Error("Failed to create parent");
    }
  }

  /**
   * Update parent
   */
  async updateParent(parentIdentifier: string, payload: UpdateParentPayload) {
    try {
      const parent = await prisma.parent.findFirst({
        where: {
          OR: [{ id: parentIdentifier }, { userId: parentIdentifier }],
        },
      });

      if (!parent) {
        return {
          success: false,
          message: "Parent not found",
        };
      }

      // Update user data if provided
      if (payload.fullName || payload.email || payload.phone) {
        await prisma.user.update({
          where: { id: parent.userId },
          data: {
            ...(payload.fullName && { name: payload.fullName }),
            ...(payload.email && { email: payload.email }),
            ...(payload.phone && { phone: payload.phone }),
          },
        });
      }

      // Update parent data
      const updateData: any = {};
      if (payload.occupation) updateData.occupation = payload.occupation;

      const updated = await prisma.parent.update({
        where: { id: parent.id },
        data: updateData,
        include: { user: true },
      });

      // Update student links if provided
      if (payload.studentIds) {
        // Delete existing links
        await prisma.parentStudent.deleteMany({
          where: { parentId: parent.id },
        });

        // Add new links
        if (payload.studentIds.length > 0) {
          try {
            await Promise.all(
              payload.studentIds.map((studentId) =>
                prisma.parentStudent.create({
                  data: {
                    parentId: parent.id,
                    studentId,
                  },
                })
              )
            );
          } catch (error) {
            console.log("Warning: Failed to link students");
          }
        }
      }

      return {
        success: true,
        message: "Parent updated successfully",
        data: {
          id: updated.id,
          name: updated.user.name,
          email: updated.user.email,
          occupation: updated.occupation,
        },
      };
    } catch (error: any) {
      throw new Error("Failed to update parent");
    }
  }

  /**
   * Delete parent
   */
  async deleteParent(parentIdentifier: string) {
    try {
      const parent = await prisma.parent.findFirst({
        where: {
          OR: [{ id: parentIdentifier }, { userId: parentIdentifier }],
        },
      });

      if (!parent) {
        return {
          success: false,
          message: "Parent not found",
        };
      }

      await prisma.$transaction([
        prisma.parent.delete({
          where: { id: parent.id },
        }),
        prisma.user.update({
          where: { id: parent.userId },
          data: { status: "inactive" },
        }),
      ]);

      return {
        success: true,
        message: "Parent deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete parent");
    }
  }

  /**
   * Get parents by occupation
   */
  async getParentsByOccupation(occupation: string) {
    try {
      const parents = await prisma.parent.findMany({
        where: { occupation },
        include: {
          user: true,
          students: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { user: { name: "asc" } },
      });

      return {
        success: true,
        data: parents.map((p) => ({
          id: p.id,
          name: p.user.name,
          email: p.user.email,
          phone: p.user.phone,
          occupation: p.occupation,
          children: p.students.map((s) => s.student.user.name),
        })),
      };
    } catch (error) {
      throw new Error("Failed to fetch parents by occupation");
    }
  }

  /**
   * Search parents
   */
  async searchParents(query: string, limit: number = 10) {
    try {
      const parents = await prisma.parent.findMany({
        where: {
          OR: [
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
            { occupation: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          occupation: true,
          user: { select: { name: true, email: true } },
          students: {
            select: {
              student: { select: { user: { select: { name: true } } } },
            },
          },
        },
        take: limit,
      });

      return {
        success: true,
        data: parents,
      };
    } catch (error) {
      throw new Error("Failed to search parents");
    }
  }

  /**
   * Export parents to CSV format
   */
  async exportParentsToCSV(options: ParentListOptions) {
    try {
      const { search, occupation, status } = options;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ];
      }

      if (occupation) {
        where.occupation = occupation;
      }

      if (status) {
        where.user = { ...where.user, status };
      }

      const parents = await prisma.parent.findMany({
        where,
        include: {
          user: true,
          students: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { user: { name: "asc" } },
      });

      // Prepare CSV data
      const csvData = parents.map((parent) => ({
        name: parent.user.name,
        email: parent.user.email,
        phone: parent.user.phone,
        occupation: parent.occupation || "N/A",
        childrenCount: parent.students.length,
        childrenNames: parent.students
          .map((s) => s.student.user.name)
          .join("; "),
        status: parent.user.status,
      }));

      // Generate CSV headers
      const headers = [
        "Name",
        "Email",
        "Phone",
        "Occupation",
        "Children Count",
        "Children Names",
        "Status",
      ];

      // Convert to CSV string
      let csv = headers.join(",") + "\n";
      csvData.forEach((row) => {
        const values = [
          `"${row.name}"`,
          `"${row.email}"`,
          `"${row.phone}"`,
          `"${row.occupation}"`,
          row.childrenCount,
          `"${row.childrenNames}"`,
          row.status,
        ];
        csv += values.join(",") + "\n";
      });

      return {
        success: true,
        data: csv,
      };
    } catch (error) {
      throw new Error("Failed to export parents to CSV");
    }
  }

  /**
   * Get all occupations
   */
  async getAllOccupations() {
    try {
      const parents = await prisma.parent.findMany({
        select: {
          occupation: true,
        },
        distinct: ["occupation"],
        where: {
          occupation: {
            not: null,
          },
        },
        orderBy: { occupation: "asc" },
      });

      const occupations = parents
        .map((p) => p.occupation)
        .filter((o) => o !== null);

      return {
        success: true,
        data: occupations,
      };
    } catch (error) {
      throw new Error("Failed to fetch occupations");
    }
  }
}

export default new AdminParentService();
