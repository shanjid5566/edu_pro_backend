"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminClassController_1 = __importDefault(require("../controllers/adminClassController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Middleware to protect all routes
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]));
// Get all classes
router.get("/", adminClassController_1.default.getAllClasses);
// Search classes
router.get("/search", adminClassController_1.default.searchClasses);
// Export classes to CSV
router.get("/export/csv", adminClassController_1.default.exportClassesToCSV);
// Get class by ID
router.get("/:classId", adminClassController_1.default.getClassById);
// Create new class
router.post("/", adminClassController_1.default.createClass);
// Update class
router.put("/:classId", adminClassController_1.default.updateClass);
// Delete class
router.delete("/:classId", adminClassController_1.default.deleteClass);
exports.default = router;
