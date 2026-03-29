"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminClassService_1 = __importDefault(require("../services/adminClassService"));
class AdminClassController {
    /**
     * Get all classes
     */
    async getAllClasses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const skip = (page - 1) * limit;
            const result = await adminClassService_1.default.getAllClasses({
                skip,
                take: limit,
                search: search || undefined,
            });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch classes",
            });
        }
    }
    /**
     * Get class by ID
     */
    async getClassById(req, res) {
        try {
            const classId = req.params.classId;
            if (!classId) {
                res.status(400).json({
                    success: false,
                    message: "Class ID is required",
                });
                return;
            }
            const result = await adminClassService_1.default.getClassById(classId);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch class",
            });
        }
    }
    /**
     * Create class
     */
    async createClass(req, res) {
        try {
            const { name, section, capacity, classTeacherId } = req.body;
            // Validation
            if (!name || !section || !capacity) {
                res.status(400).json({
                    success: false,
                    message: "Class name, section and capacity are required",
                });
                return;
            }
            if (capacity < 1) {
                res.status(400).json({
                    success: false,
                    message: "Capacity must be at least 1",
                });
                return;
            }
            const result = await adminClassService_1.default.createClass({
                name,
                section,
                capacity,
                classTeacherId,
            });
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to create class",
            });
        }
    }
    /**
     * Update class
     */
    async updateClass(req, res) {
        try {
            const classId = req.params.classId;
            const { name, section, capacity, classTeacherId } = req.body;
            if (!classId) {
                res.status(400).json({
                    success: false,
                    message: "Class ID is required",
                });
                return;
            }
            if (capacity && capacity < 1) {
                res.status(400).json({
                    success: false,
                    message: "Capacity must be at least 1",
                });
                return;
            }
            const result = await adminClassService_1.default.updateClass(classId, {
                name,
                section,
                capacity,
                classTeacherId,
            });
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update class",
            });
        }
    }
    /**
     * Delete class
     */
    async deleteClass(req, res) {
        try {
            const classId = req.params.classId;
            if (!classId) {
                res.status(400).json({
                    success: false,
                    message: "Class ID is required",
                });
                return;
            }
            const result = await adminClassService_1.default.deleteClass(classId);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete class",
            });
        }
    }
    /**
     * Search classes
     */
    async searchClasses(req, res) {
        try {
            const query = req.query.q || "";
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
                return;
            }
            const result = await adminClassService_1.default.searchClasses(query, limit);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to search classes",
            });
        }
    }
    /**
     * Export classes to CSV
     */
    async exportClassesToCSV(req, res) {
        try {
            const search = req.query.search || "";
            const result = await adminClassService_1.default.exportClassesToCSV({
                skip: 0,
                take: 1000,
                search: search || undefined,
            });
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=classes.csv");
            res.send(result.data);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to export classes",
            });
        }
    }
}
exports.default = new AdminClassController();
