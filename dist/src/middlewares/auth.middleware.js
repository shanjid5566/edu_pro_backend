import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";
import { UnauthorizedError } from "../utils/errors.js";
/**
 * Verify JWT token middleware
 */
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided");
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError("Invalid token"));
        }
        else if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError("Token expired"));
        }
        else {
            next(error);
        }
    }
};
/**
 * Check if user has required role
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedError("Not authenticated"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new UnauthorizedError("You don't have permission to access this resource"));
        }
        next();
    };
};
export default { verifyToken, requireRole };
//# sourceMappingURL=auth.middleware.js.map