"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminParentService_1 = __importDefault(require("../services/adminParentService"));
class AdminParentController {
    /**
     * Get all parents with pagination and filters
     */
    async getAllParents(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || undefined;
            const occupation = req.query.occupation || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminParentService_1.default.getAllParents({
                skip,
                take: limit,
                search,
                occupation,
                status,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get parent profile by ID
     */
    async getParentById(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await adminParentService_1.default.getParentById(id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Create new parent
     */
    async createParent(req, res) {
        try {
            const { fullName, email, password, phone, occupation, studentIds, } = req.body;
            // Validation
            if (!fullName || !email || !password || !occupation) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (fullName, email, password, occupation)",
                });
            }
            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long",
                });
            }
            const result = await adminParentService_1.default.createParent({
                fullName,
                email,
                password,
                phone,
                occupation,
                studentIds,
            });
            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Update parent
     */
    async updateParent(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updateData = req.body;
            const result = await adminParentService_1.default.updateParent(id, updateData);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Delete parent
     */
    async deleteParent(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await adminParentService_1.default.deleteParent(id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get parents by occupation
     */
    async getParentsByOccupation(req, res) {
        try {
            const occupation = Array.isArray(req.params.occupation)
                ? req.params.occupation[0]
                : req.params.occupation;
            const result = await adminParentService_1.default.getParentsByOccupation(occupation);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Search parents
     */
    async searchParents(req, res) {
        try {
            const { query } = req.query;
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
            }
            const result = await adminParentService_1.default.searchParents(query, limit);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Export parents to CSV
     */
    async exportParentsToCSV(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10000;
            const search = req.query.search || undefined;
            const occupation = req.query.occupation || undefined;
            const status = req.query.status || undefined;
            const skip = (page - 1) * limit;
            const result = await adminParentService_1.default.exportParentsToCSV({
                skip,
                take: limit,
                search,
                occupation,
                status,
            });
            if (result.success) {
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", "attachment; filename=parents.csv");
                return res.send(result.data);
            }
            return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get all occupations
     */
    async getAllOccupations(req, res) {
        try {
            const result = await adminParentService_1.default.getAllOccupations();
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new AdminParentController();
