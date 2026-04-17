import { Router } from "express";
import messagingController from "../controllers/messagingController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

// Messaging is available only for admin, teacher, and student.
router.use(verifyToken, checkRole("ADMIN", "TEACHER", "STUDENT"));

/**
 * @route GET /messages/conversations?limit=30
 * @description Get conversation list for chat sidebar (user + last message)
 * @access Private - Admin/Teacher/Student
 */
router.get("/conversations", messagingController.getConversations);

/**
 * @route GET /messages/search?query=jo&limit=10
 * @description Search allowed users for live suggestions in chat
 * @access Private - Admin/Teacher/Student
 */
router.get("/search", messagingController.searchUsers);

/**
 * @route GET /messages/conversation/:userId?limit=50
 * @description Get message history with a specific user
 * @access Private - Admin/Teacher/Student
 */
router.get("/conversation/:userId", messagingController.getConversation);

export default router;
