import { Request, Response } from "express";
import parentChildFeesService from "../services/parentChildFeesService.js";

class ParentChildFeesController {
  // Get all fees
  async getAllFees(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const { limit, offset } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 50;
      const offsetParam = offset ? parseInt(offset as string) : 0;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildFeesService.getAllFees(
        parentId,
        studentId,
        limitParam,
        offsetParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllFees:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fee summary
  async getFeeSummary(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildFeesService.getFeeSummary(parentId, studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeeSummary:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fees by status
  async getFeesByStatus(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const status = req.params.status as string;
      const { limit, offset } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 50;
      const offsetParam = offset ? parseInt(offset as string) : 0;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await parentChildFeesService.getFeesByStatus(
        parentId,
        studentId,
        status,
        limitParam,
        offsetParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeesByStatus:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fees by type
  async getFeesByType(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildFeesService.getFeesByType(parentId, studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeesByType:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get upcoming fees
  async getUpcomingFees(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildFeesService.getUpcomingFees(parentId, studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getUpcomingFees:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get overdue fees
  async getOverdueFees(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildFeesService.getOverdueFees(parentId, studentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getOverdueFees:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get fees timeline
  async getFeesTimeline(req: Request, res: Response) {
    try {
      const parentId = (req as any).userId;
      const studentId = req.params.studentId as string;
      const { limit } = req.query;
      const limitParam = limit ? parseInt(limit as string) : 10;

      if (!parentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await parentChildFeesService.getFeesTimeline(
        parentId,
        studentId,
        limitParam
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFeesTimeline:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ParentChildFeesController();
