"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messagingController_js_1 = __importDefault(require("../controllers/messagingController.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// Messaging is available only for admin, teacher, and student.
router.use(authMiddleware_js_1.verifyToken, (0, authMiddleware_js_1.checkRole)("ADMIN", "TEACHER", "STUDENT"));
/**
 * @route GET /messages/conversations?limit=30
 * @description Get conversation list for chat sidebar (user + last message)
 * @access Private - Admin/Teacher/Student
 */
router.get("/conversations", messagingController_js_1.default.getConversations);
/**
 * @route GET /messages/search?query=jo&limit=10
 * @description Search allowed users for live suggestions in chat
 * @access Private - Admin/Teacher/Student
 */
router.get("/search", messagingController_js_1.default.searchUsers);
/**
 * @route GET /messages/conversation/:userId?limit=50
 * @description Get message history with a specific user
 * @access Private - Admin/Teacher/Student
 */
router.get("/conversation/:userId", messagingController_js_1.default.getConversation);
exports.default = router;
