import { parentService } from "../services/parent.service";
import { ValidationError } from "../utils/errors";
export class ParentController {
    /**
     * GET /api/v1/parents
     * Get all parents with pagination
     */
    async getParents(req, res) {
        try {
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const searchParam = String(Array.isArray(req.query.search) ? req.query.search[0] : req.query.search || "");
            const statusParam = String(Array.isArray(req.query.status) ? req.query.status[0] : req.query.status || "");
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (page < 1) {
                throw new ValidationError("Page must be greater than 0");
            }
            if (pageSize < 1 || pageSize > 100) {
                throw new ValidationError("PageSize must be between 1 and 100");
            }
            const result = await parentService.getParents(page, pageSize, searchParam || undefined, statusParam || undefined);
            res.json({
                success: true,
                message: "Parents retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve parents",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/parents/:id
     * Get single parent
     */
    async getParentById(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Parent ID is required");
            }
            const parent = await parentService.getParentById(id);
            res.json({
                success: true,
                message: "Parent retrieved successfully",
                data: parent,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve parent",
                error: error.message,
            });
        }
    }
    /**
     * POST /api/v1/parents
     * Create parent (Admin only)
     */
    async createParent(req, res) {
        try {
            const { name, email, phone, occupation, password } = req.body;
            if (!name || !name.trim()) {
                throw new ValidationError("Name is required");
            }
            if (!email || !email.trim()) {
                throw new ValidationError("Email is required");
            }
            if (!phone || !phone.trim()) {
                throw new ValidationError("Phone is required");
            }
            const parent = await parentService.createParent({
                name,
                email,
                phone,
                occupation,
                password,
            });
            res.status(201).json({
                success: true,
                message: "Parent created successfully",
                data: parent,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to create parent",
                error: error.message,
            });
        }
    }
    /**
     * PUT /api/v1/parents/:id
     * Update parent (Admin only)
     */
    async updateParent(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Parent ID is required");
            }
            const { name, email, phone, occupation, status } = req.body;
            if (!name && !email && !phone && occupation === undefined && !status) {
                throw new ValidationError("At least one field must be provided");
            }
            const parent = await parentService.updateParent(id, {
                name,
                email,
                phone,
                occupation,
                status,
            });
            res.json({
                success: true,
                message: "Parent updated successfully",
                data: parent,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to update parent",
                error: error.message,
            });
        }
    }
    /**
     * DELETE /api/v1/parents/:id
     * Delete parent (Admin only)
     */
    async deleteParent(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Parent ID is required");
            }
            await parentService.deleteParent(id);
            res.json({
                success: true,
                message: "Parent deleted successfully",
                data: null,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to delete parent",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/parents/stats
     * Get parent statistics
     */
    async getStatistics(req, res) {
        try {
            const stats = await parentService.getStatistics();
            res.json({
                success: true,
                message: "Parent statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to retrieve statistics",
                error: error.message,
            });
        }
    }
    /**
     * POST /api/v1/parents/:id/students
     * Assign students to parent
     */
    async assignStudents(req, res) {
        try {
            const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (!id || !id.trim()) {
                throw new ValidationError("Parent ID is required");
            }
            const { studentIds } = req.body;
            if (!Array.isArray(studentIds) || studentIds.length === 0) {
                throw new ValidationError("Student IDs array is required and must not be empty");
            }
            const parent = await parentService.assignStudents(id, { studentIds });
            res.json({
                success: true,
                message: "Students assigned successfully",
                data: parent,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to assign students",
                error: error.message,
            });
        }
    }
    /**
     * POST /api/v1/parents/bulk
     * Bulk create parents (Admin only)
     */
    async bulkCreateParents(req, res) {
        try {
            const { parents } = req.body;
            if (!Array.isArray(parents) || parents.length === 0) {
                throw new ValidationError("Parents array is required and must not be empty");
            }
            const result = await parentService.bulkCreateParents({ parents });
            res.status(201).json({
                success: true,
                message: "Bulk parents created successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to bulk create parents",
                error: error.message,
            });
        }
    }
    /**
     * GET /api/v1/parents/search/:query
     * Search parents by name
     */
    async searchParents(req, res) {
        try {
            const queryParam = String(Array.isArray(req.params.query) ? req.params.query[0] : req.params.query || "");
            const pageParam = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page || "");
            const pageSizeParam = String(Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize || "");
            const query = queryParam;
            const page = parseInt(pageParam || "1") || 1;
            const pageSize = parseInt(pageSizeParam || "10") || 10;
            if (!query || !query.trim()) {
                throw new ValidationError("Search query is required");
            }
            const result = await parentService.searchParents(query, page, pageSize);
            res.json({
                success: true,
                message: "Search results retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            const status = error.statusCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || "Failed to search parents",
                error: error.message,
            });
        }
    }
}
export const parentController = new ParentController();
//# sourceMappingURL=parent.controller.js.map