import { db } from "../config/database.config";
import { BadRequestError, NotFoundError } from "../utils/errors";
import bcrypt from "bcrypt";
import {
  CreateParentInput,
  UpdateParentInput,
  ParentResponse,
  ParentWithStudents,
  ParentListResponse,
  ParentStatistics,
  BulkCreateParentsInput,
  BulkCreateParentsResponse,
  AssignStudentInput,
} from "../types/parent.dto";

export class ParentService {
  /**
   * Create a new parent
   */
  async createParent(input: CreateParentInput): Promise<ParentResponse> {
    // Validate required fields
    if (!input.name || !input.name.trim()) {
      throw new BadRequestError("Name is required");
    }

    if (!input.email || !input.email.trim()) {
      throw new BadRequestError("Email is required");
    }

    if (!input.phone || !input.phone.trim()) {
      throw new BadRequestError("Phone is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new BadRequestError("Invalid email format");
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new BadRequestError(`Email ${input.email} is already registered`);
    }

    // Generate default password if not provided
    const password = input.password || "Parent@123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and parent in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: input.name.trim(),
          email: input.email.toLowerCase().trim(),
          phone: input.phone.trim(),
          password: hashedPassword,
          role: "PARENT",
          status: "active",
        },
      });

      // Create parent
      const parent = await tx.parent.create({
        data: {
          userId: user.id,
          occupation: input.occupation?.trim() || null,
        },
      });

      return { user, parent };
    });

    return {
      id: result.parent.id,
      userId: result.user.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone || "",
      occupation: result.parent.occupation || undefined,
      status: result.user.status,
      createdAt: result.user.createdAt,
    };
  }

  /**
   * Get parent by ID
   */
  async getParentById(id: string): Promise<ParentWithStudents> {
    const parent = await db.parent.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
          },
        },
        students: {
          include: {
            student: {
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
              },
            },
          },
        },
      },
    });

    if (!parent) {
      throw new NotFoundError(`Parent with ID ${id} not found`);
    }

    return {
      id: parent.id,
      userId: parent.user.id,
      name: parent.user.name,
      email: parent.user.email,
      phone: parent.user.phone || "",
      occupation: parent.occupation || undefined,
      status: parent.user.status,
      createdAt: parent.user.createdAt,
      students: parent.students.map((ps) => ({
        id: ps.student.id,
        name: ps.student.user.name,
        rollNumber: ps.student.rollNumber,
        className: ps.student.class.name,
        section: ps.student.class.section,
      })),
      studentCount: parent.students.length,
    };
  }

  /**
   * Get all parents with pagination and filters
   */
  async getParents(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    status?: string,
    occupation?: string
  ): Promise<ParentListResponse> {
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (status) {
      const validStatuses = ["active", "inactive"];
      if (!validStatuses.includes(status.toLowerCase())) {
        throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      }
      where.user = {
        status: status.toLowerCase(),
      };
    }

    if (search) {
      where.user = {
        ...where.user,
        OR: [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { email: { contains: search.trim(), mode: "insensitive" } },
          { phone: { contains: search.trim(), mode: "insensitive" } },
        ],
      };
    }

    if (occupation) {
      where.occupation = {
        contains: occupation.trim(),
        mode: "insensitive",
      };
    }

    const total = await db.parent.count({ where });

    const parents = await db.parent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
          },
        },
        students: {
          include: {
            student: {
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
              },
            },
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { user: { name: "asc" } },
    });

    return {
      parents: parents.map((parent) => ({
        id: parent.id,
        userId: parent.user.id,
        name: parent.user.name,
        email: parent.user.email,
        phone: parent.user.phone || "",
        occupation: parent.occupation || undefined,
        status: parent.user.status,
        createdAt: parent.user.createdAt,
        students: parent.students.map((ps) => ({
          id: ps.student.id,
          name: ps.student.user.name,
          rollNumber: ps.student.rollNumber,
          className: ps.student.class.name,
          section: ps.student.class.section,
        })),
        studentCount: parent.students.length,
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Update parent
   */
  async updateParent(id: string, input: UpdateParentInput): Promise<ParentResponse> {
    // Check if parent exists
    const existing = await db.parent.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      throw new NotFoundError(`Parent with ID ${id} not found`);
    }

    // Validate inputs
    if (input.name && !input.name.trim()) {
      throw new BadRequestError("Name cannot be empty");
    }

    if (input.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        throw new BadRequestError("Invalid email format");
      }

      // Check if email is already taken by another user
      const emailExists = await db.user.findUnique({
        where: { email: input.email.toLowerCase().trim() },
      });

      if (emailExists && emailExists.id !== existing.userId) {
        throw new BadRequestError(`Email ${input.email} is already in use`);
      }
    }

    if (input.status) {
      const validStatuses = ["active", "inactive"];
      if (!validStatuses.includes(input.status.toLowerCase())) {
        throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      }
    }

    // Update parent and user in transaction
    const result = await db.$transaction(async (tx) => {
      // Prepare user update data
      const userUpdateData: any = {};
      if (input.name !== undefined) {
        userUpdateData.name = input.name.trim();
      }
      if (input.email !== undefined) {
        userUpdateData.email = input.email.toLowerCase().trim();
      }
      if (input.phone !== undefined) {
        userUpdateData.phone = input.phone.trim();
      }
      if (input.status !== undefined) {
        userUpdateData.status = input.status.toLowerCase();
      }

      // Update user if there are changes
      let user = existing.user;
      if (Object.keys(userUpdateData).length > 0) {
        user = await tx.user.update({
          where: { id: existing.userId },
          data: userUpdateData,
        });
      }

      // Prepare parent update data
      const parentUpdateData: any = {};
      if (input.occupation !== undefined) {
        parentUpdateData.occupation = input.occupation.trim() || null;
      }

      // Update parent if there are changes
      let parent = existing;
      if (Object.keys(parentUpdateData).length > 0) {
        parent = await tx.parent.update({
          where: { id },
          data: parentUpdateData,
          include: {
            user: true,
          },
        });
      }

      return { user, parent };
    });

    return {
      id: result.parent.id,
      userId: result.user.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone || "",
      occupation: result.parent.occupation || undefined,
      status: result.user.status,
      createdAt: result.user.createdAt,
    };
  }

  /**
   * Delete parent
   */
  async deleteParent(id: string): Promise<void> {
    const parent = await db.parent.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!parent) {
      throw new NotFoundError(`Parent with ID ${id} not found`);
    }

    // Delete user (cascade will delete parent and related records)
    await db.user.delete({
      where: { id: parent.userId },
    });
  }

  /**
   * Search parents by name
   */
  async searchParents(query: string, page: number = 1, pageSize: number = 10): Promise<ParentListResponse> {
    if (!query || !query.trim()) {
      throw new BadRequestError("Search query cannot be empty");
    }
    return this.getParents(page, pageSize, query);
  }

  /**
   * Get parent statistics
   */
  async getStatistics(): Promise<ParentStatistics> {
    const parents = await db.parent.findMany({
      include: {
        user: true,
        students: true,
      },
    });

    const total = parents.length;
    const active = parents.filter((p) => p.user.status === "active").length;
    const inactive = parents.filter((p) => p.user.status === "inactive").length;

    const totalChildren = parents.reduce((sum, p) => sum + p.students.length, 0);
    const avgChildrenPerParent = total > 0 ? Math.round((totalChildren / total) * 10) / 10 : 0;

    const parentsWithMultipleChildren = parents.filter((p) => p.students.length > 1).length;

    return {
      total,
      active,
      inactive,
      avgChildrenPerParent,
      parentsWithMultipleChildren,
    };
  }

  /**
   * Assign students to parent
   */
  async assignStudents(parentId: string, input: AssignStudentInput): Promise<ParentWithStudents> {
    // Check if parent exists
    const parent = await db.parent.findUnique({ where: { id: parentId } });
    if (!parent) {
      throw new NotFoundError(`Parent with ID ${parentId} not found`);
    }

    if (!Array.isArray(input.studentIds) || input.studentIds.length === 0) {
      throw new BadRequestError("Student IDs array is required and must not be empty");
    }

    // Verify all students exist
    const students = await db.student.findMany({
      where: { id: { in: input.studentIds } },
    });

    if (students.length !== input.studentIds.length) {
      throw new BadRequestError("One or more student IDs are invalid");
    }

    // Delete existing student assignments and create new ones
    await db.parentStudent.deleteMany({ where: { parentId } });

    await db.parentStudent.createMany({
      data: input.studentIds.map((studentId) => ({
        parentId,
        studentId,
      })),
    });

    return this.getParentById(parentId);
  }

  /**
   * Bulk create parents
   */
  async bulkCreateParents(input: BulkCreateParentsInput): Promise<BulkCreateParentsResponse> {
    let successful = 0;
    let failed = 0;
    const errors: any[] = [];

    for (let i = 0; i < input.parents.length; i++) {
      try {
        await this.createParent(input.parents[i]);
        successful++;
      } catch (error: any) {
        failed++;
        errors.push({
          index: i,
          error: error.message || "Failed to create parent",
        });
      }
    }

    return {
      total: successful + failed,
      successful,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}

export const parentService = new ParentService();
