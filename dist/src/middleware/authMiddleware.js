"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.verifyToken = void 0;
const authService_1 = __importDefault(require("../services/authService"));
/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const { valid, decoded } = authService_1.default.verifyToken(token);
        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        // Attach user info to request
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Error verifying token",
        });
    }
};
exports.verifyToken = verifyToken;
/**
 * Middleware to check user role
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.userRole;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Permission denied",
            });
        }
        next();
    };
};
exports.checkRole = checkRole;
