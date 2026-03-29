"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminParentService {
    /**
     * Get all parents with pagination and filters
     */
    async getAllParents(options) {
        try {
            const { skip, take, search, occupation, status } = options;
            // Build where clause
            const where = {};
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
                prisma_1.prisma.parent.findMany({
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
                prisma_1.prisma.parent.count({ where }),
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
        }
        catch (error) {
            throw new Error("Failed to fetch parents");
        }
    }
    /**
     * Get parent profile by ID
     */
    async getParentById(parentId) {
        try {
            const parent = await prisma_1.prisma.parent.findUnique({
                where: { id: parentId },
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
        }
        catch (error) {
            throw new Error("Failed to fetch parent details");
        }
    }
    /**
     * Create new parent
     */
    async createParent(payload) {
        try {
            // Check if email already exists
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email: payload.email },
            });
            if (existingUser) {
                return {
                    success: false,
                    message: "Email already exists",
                };
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
            // Create user first
            const user = await prisma_1.prisma.user.create({
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
            const parent = await prisma_1.prisma.parent.create({
                data: {
                    userId: user.id,
                    occupation: payload.occupation,
                },
            });
            // Link students to parent if provided
            if (payload.studentIds && payload.studentIds.length > 0) {
                try {
                    await Promise.all(payload.studentIds.map((studentId) => prisma_1.prisma.parentStudent.create({
                        data: {
                            parentId: parent.id,
                            studentId,
                        },
                    })));
                }
                catch (error) {
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
        }
        catch (error) {
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
    async updateParent(parentId, payload) {
        try {
            const parent = await prisma_1.prisma.parent.findUnique({
                where: { id: parentId },
            });
            if (!parent) {
                return {
                    success: false,
                    message: "Parent not found",
                };
            }
            // Update user data if provided
            if (payload.fullName || payload.email || payload.phone) {
                await prisma_1.prisma.user.update({
                    where: { id: parent.userId },
                    data: {
                        ...(payload.fullName && { name: payload.fullName }),
                        ...(payload.email && { email: payload.email }),
                        ...(payload.phone && { phone: payload.phone }),
                    },
                });
            }
            // Update parent data
            const updateData = {};
            if (payload.occupation)
                updateData.occupation = payload.occupation;
            const updated = await prisma_1.prisma.parent.update({
                where: { id: parentId },
                data: updateData,
                include: { user: true },
            });
            // Update student links if provided
            if (payload.studentIds) {
                // Delete existing links
                await prisma_1.prisma.parentStudent.deleteMany({
                    where: { parentId },
                });
                // Add new links
                if (payload.studentIds.length > 0) {
                    try {
                        await Promise.all(payload.studentIds.map((studentId) => prisma_1.prisma.parentStudent.create({
                            data: {
                                parentId,
                                studentId,
                            },
                        })));
                    }
                    catch (error) {
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
        }
        catch (error) {
            throw new Error("Failed to update parent");
        }
    }
    /**
     * Delete parent
     */
    async deleteParent(parentId) {
        try {
            const parent = await prisma_1.prisma.parent.findUnique({
                where: { id: parentId },
            });
            if (!parent) {
                return {
                    success: false,
                    message: "Parent not found",
                };
            }
            // Delete related records due to cascade
            await prisma_1.prisma.parent.delete({
                where: { id: parentId },
            });
            // Delete user
            await prisma_1.prisma.user.delete({
                where: { id: parent.userId },
            });
            return {
                success: true,
                message: "Parent deleted successfully",
            };
        }
        catch (error) {
            throw new Error("Failed to delete parent");
        }
    }
    /**
     * Get parents by occupation
     */
    async getParentsByOccupation(occupation) {
        try {
            const parents = await prisma_1.prisma.parent.findMany({
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
        }
        catch (error) {
            throw new Error("Failed to fetch parents by occupation");
        }
    }
    /**
     * Search parents
     */
    async searchParents(query, limit = 10) {
        try {
            const parents = await prisma_1.prisma.parent.findMany({
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
        }
        catch (error) {
            throw new Error("Failed to search parents");
        }
    }
    /**
     * Export parents to CSV format
     */
    async exportParentsToCSV(options) {
        try {
            const { search, occupation, status } = options;
            // Build where clause
            const where = {};
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
            const parents = await prisma_1.prisma.parent.findMany({
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
        }
        catch (error) {
            throw new Error("Failed to export parents to CSV");
        }
    }
    /**
     * Get all occupations
     */
    async getAllOccupations() {
        try {
            const parents = await prisma_1.prisma.parent.findMany({
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
        }
        catch (error) {
            throw new Error("Failed to fetch occupations");
        }
    }
}
exports.default = new AdminParentService();
