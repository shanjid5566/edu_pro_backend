"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messagingService_js_1 = __importDefault(require("../services/messagingService.js"));
class MessagingController {
    async getConversations(req, res) {
        try {
            const currentUserId = req.userId;
            const currentUserRole = req.userRole;
            const limit = parseInt((req.query.limit || "30").toString(), 10);
            if (!currentUserId || !currentUserRole) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const conversations = await messagingService_js_1.default.getConversationList(currentUserId, currentUserRole, Number.isNaN(limit) ? 30 : limit);
            return res.status(200).json({
                success: true,
                data: conversations,
            });
        }
        catch (error) {
            console.error("Error in getConversations:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async searchUsers(req, res) {
        try {
            const currentUserId = req.userId;
            const currentUserRole = req.userRole;
            const query = (req.query.query || "").toString();
            const limit = parseInt((req.query.limit || "10").toString(), 10);
            if (!currentUserId || !currentUserRole) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const users = await messagingService_js_1.default.searchUsersForMessaging(currentUserId, currentUserRole, query, Number.isNaN(limit) ? 10 : limit);
            return res.status(200).json({
                success: true,
                data: users,
            });
        }
        catch (error) {
            console.error("Error in searchUsers:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async getConversation(req, res) {
        try {
            const currentUserId = req.userId;
            const currentUserRole = req.userRole;
            const otherUserId = req.params.userId;
            const limit = parseInt((req.query.limit || "50").toString(), 10);
            if (!currentUserId || !currentUserRole) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!otherUserId) {
                return res.status(400).json({
                    success: false,
                    message: "userId is required",
                });
            }
            const messages = await messagingService_js_1.default.getConversationMessages(currentUserId, currentUserRole, otherUserId, Number.isNaN(limit) ? 50 : limit);
            return res.status(200).json({
                success: true,
                data: messages,
            });
        }
        catch (error) {
            console.error("Error in getConversation:", error);
            if (error instanceof Error &&
                (error.message.includes("not allowed") ||
                    error.message.includes("not found") ||
                    error.message.includes("inactive"))) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
}
exports.default = new MessagingController();
