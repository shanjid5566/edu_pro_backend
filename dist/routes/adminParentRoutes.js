"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminParentController_1 = __importDefault(require("../controllers/adminParentController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all parents (with pagination, search, filters)
router.get("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.getAllParents);
// Export parents to CSV
router.get("/export/csv", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.exportParentsToCSV);
// Search parents
router.get("/search", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.searchParents);
// Get all occupations
router.get("/occupations/list", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.getAllOccupations);
// Get parents by occupation
router.get("/occupation/:occupation", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.getParentsByOccupation);
// Get parent profile by ID
router.get("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.getParentById);
// Create new parent
router.post("/", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.createParent);
// Update parent
router.put("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.updateParent);
// Delete parent
router.delete("/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), adminParentController_1.default.deleteParent);
exports.default = router;
