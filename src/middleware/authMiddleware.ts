import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const { valid, decoded } = authService.verifyToken(token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Attach user info to request
    (req as any).userId = decoded.userId;
    (req as any).userEmail = decoded.email;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying token",
    });
  }
};

/**
 * Middleware to check user role
 */
export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    next();
  };
};
