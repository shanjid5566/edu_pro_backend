"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getSocketServer = getSocketServer;
const socket_io_1 = require("socket.io");
const authService_1 = __importDefault(require("../services/authService"));
const prisma_1 = require("../lib/prisma");
const messagingService_1 = __importDefault(require("../services/messagingService"));
const env_1 = require("../config/env");
let ioInstance = null;
const socketCorsOrigins = env_1.env.CORS_ORIGINS;
function getTokenFromSocket(socket) {
    const authToken = socket.handshake.auth?.token;
    if (typeof authToken === "string" && authToken.trim()) {
        return authToken.startsWith("Bearer ")
            ? authToken.slice(7)
            : authToken.trim();
    }
    const headerToken = socket.handshake.headers.authorization;
    if (typeof headerToken === "string" && headerToken.trim()) {
        return headerToken.startsWith("Bearer ")
            ? headerToken.slice(7)
            : headerToken.trim();
    }
    return null;
}
function getSocketUser(socket) {
    return socket.data.user;
}
function initializeSocket(httpServer) {
    if (ioInstance) {
        return ioInstance;
    }
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || socketCorsOrigins.includes(origin)) {
                    callback(null, true);
                    return;
                }
                callback(new Error("CORS blocked by Socket.IO"));
            },
            credentials: true,
            methods: ["GET", "POST"],
        },
    });
    io.use(async (socket, next) => {
        try {
            const token = getTokenFromSocket(socket);
            if (!token) {
                return next(new Error("Unauthorized: token missing"));
            }
            const { valid, decoded } = authService_1.default.verifyToken(token);
            if (!valid || !decoded?.userId) {
                return next(new Error("Unauthorized: invalid token"));
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            });
            if (!user || user.status !== "active") {
                return next(new Error("Unauthorized: user not active"));
            }
            socket.data.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            next();
        }
        catch (error) {
            next(new Error("Unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        const currentUser = getSocketUser(socket);
        const currentUserRoom = `user:${currentUser.id}`;
        socket.join(currentUserRoom);
        socket.emit("socket:ready", {
            success: true,
            data: {
                userId: currentUser.id,
                role: currentUser.role,
            },
        });
        socket.on("users:search", async (payload, ack) => {
            try {
                const query = (payload?.query || "").toString();
                const limit = Number(payload?.limit || 10);
                const users = await messagingService_1.default.searchUsersForMessaging(currentUser.id, currentUser.role, query, Number.isNaN(limit) ? 10 : limit);
                const response = { success: true, data: users };
                if (typeof ack === "function") {
                    ack(response);
                    return;
                }
                socket.emit("users:search:result", response);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Failed to search users";
                if (typeof ack === "function") {
                    ack({ success: false, message });
                    return;
                }
                socket.emit("users:search:error", { success: false, message });
            }
        });
        socket.on("messages:history", async (payload, ack) => {
            try {
                const otherUserId = (payload?.userId || "").toString();
                const limit = Number(payload?.limit || 50);
                if (!otherUserId) {
                    throw new Error("userId is required");
                }
                const messages = await messagingService_1.default.getConversationMessages(currentUser.id, currentUser.role, otherUserId, Number.isNaN(limit) ? 50 : limit);
                const response = { success: true, data: messages };
                if (typeof ack === "function") {
                    ack(response);
                    return;
                }
                socket.emit("messages:history:result", response);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Failed to fetch history";
                if (typeof ack === "function") {
                    ack({ success: false, message });
                    return;
                }
                socket.emit("messages:history:error", { success: false, message });
            }
        });
        socket.on("message:send", async (payload, ack) => {
            try {
                const receiverId = (payload?.receiverId || "").toString();
                const messageText = (payload?.message || "").toString();
                if (!receiverId) {
                    throw new Error("receiverId is required");
                }
                const savedMessage = await messagingService_1.default.createMessage(currentUser.id, currentUser.role, receiverId, messageText);
                const eventPayload = {
                    success: true,
                    data: savedMessage,
                };
                io.to(`user:${currentUser.id}`).to(`user:${receiverId}`).emit("message:new", eventPayload);
                if (typeof ack === "function") {
                    ack(eventPayload);
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Failed to send message";
                if (typeof ack === "function") {
                    ack({ success: false, message });
                    return;
                }
                socket.emit("message:error", { success: false, message });
            }
        });
    });
    ioInstance = io;
    return io;
}
function getSocketServer() {
    if (!ioInstance) {
        throw new Error("Socket.IO is not initialized");
    }
    return ioInstance;
}
