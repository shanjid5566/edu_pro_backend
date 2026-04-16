"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canSendMessage = canSendMessage;
const prisma_1 = require("../lib/prisma");
const MAX_SEARCH_RESULTS = 20;
const MAX_HISTORY_LIMIT = 200;
const allowedRecipientRolesBySender = {
    ADMIN: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    TEACHER: ["STUDENT", "ADMIN"],
    STUDENT: ["TEACHER"],
    PARENT: [],
};
function canSendMessage(senderRole, receiverRole) {
    const allowedRecipients = allowedRecipientRolesBySender[senderRole] || [];
    return allowedRecipients.includes(receiverRole);
}
class MessagingService {
    async searchUsersForMessaging(currentUserId, currentUserRole, query, limit = 10) {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) {
            return [];
        }
        const allowedRoles = allowedRecipientRolesBySender[currentUserRole] || [];
        if (allowedRoles.length === 0) {
            return [];
        }
        const safeLimit = Math.min(Math.max(limit, 1), MAX_SEARCH_RESULTS);
        const users = await prisma_1.prisma.user.findMany({
            where: {
                id: { not: currentUserId },
                status: "active",
                role: { in: allowedRoles },
                name: { contains: normalizedQuery, mode: "insensitive" },
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
            },
            orderBy: [{ name: "asc" }],
            take: safeLimit,
        });
        return users;
    }
    async createMessage(senderId, senderRole, receiverId, rawMessage) {
        const message = rawMessage?.trim();
        if (!message) {
            throw new Error("Message cannot be empty");
        }
        if (message.length > 2000) {
            throw new Error("Message is too long (max 2000 characters)");
        }
        if (senderId === receiverId) {
            throw new Error("You cannot message yourself");
        }
        const receiver = await prisma_1.prisma.user.findUnique({
            where: { id: receiverId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });
        if (!receiver || receiver.status !== "active") {
            throw new Error("Receiver not found or inactive");
        }
        if (!canSendMessage(senderRole, receiver.role)) {
            throw new Error("You are not allowed to send messages to this user");
        }
        const created = await prisma_1.prisma.chatMessage.create({
            data: {
                senderId,
                receiverId,
                message,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        avatar: true,
                    },
                },
            },
        });
        return created;
    }
    async getConversationMessages(currentUserId, currentUserRole, otherUserId, limit = 50) {
        const safeLimit = Math.min(Math.max(limit, 1), MAX_HISTORY_LIMIT);
        const otherUser = await prisma_1.prisma.user.findUnique({
            where: { id: otherUserId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });
        if (!otherUser || otherUser.status !== "active") {
            throw new Error("User not found or inactive");
        }
        const canCurrentMessageOther = canSendMessage(currentUserRole, otherUser.role);
        const canOtherMessageCurrent = canSendMessage(otherUser.role, currentUserRole);
        if (!canCurrentMessageOther && !canOtherMessageCurrent) {
            throw new Error("You are not allowed to view this conversation");
        }
        const messages = await prisma_1.prisma.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: safeLimit,
        });
        return messages.reverse();
    }
}
exports.default = new MessagingService();
