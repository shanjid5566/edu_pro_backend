import { Request, Response } from "express";
import adminClassService from "../services/adminClassService";

class AdminClassController {
  /**
   * Get all classes
   */
  async getAllClasses(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      const skip = (page - 1) * limit;

      const result = await adminClassService.getAllClasses({
        skip,
        take: limit,
        search: search || undefined,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch classes",
      });
    }
  }

  /**
   * Get class by ID
   */
  async getClassById(req: Request, res: Response) {
    try {
      const classId = req.params.classId as string;

      if (!classId) {
        res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
        return;
      }

      const result = await adminClassService.getClassById(classId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch class",
      });
    }
  }

  /**
   * Create class
   */
  async createClass(req: Request, res: Response) {
    try {
      const { name, section, capacity, classTeacherId } = req.body;

      // Validation
      if (!name || !section || !capacity) {
        res.status(400).json({
          success: false,
          message: "Class name, section and capacity are required",
        });
        return;
      }

      if (capacity < 1) {
        res.status(400).json({
          success: false,
          message: "Capacity must be at least 1",
        });
        return;
      }

      const result = await adminClassService.createClass({
        name,
        section,
        capacity,
        classTeacherId,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create class",
      });
    }
  }

  /**
   * Update class
   */
  async updateClass(req: Request, res: Response) {
    try {
      const classId = req.params.classId as string;
      const { name, section, capacity, classTeacherId } = req.body;

      if (!classId) {
        res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
        return;
      }

      if (capacity && capacity < 1) {
        res.status(400).json({
          success: false,
          message: "Capacity must be at least 1",
        });
        return;
      }

      const result = await adminClassService.updateClass(classId, {
        name,
        section,
        capacity,
        classTeacherId,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update class",
      });
    }
  }

  /**
   * Delete class
   */
  async deleteClass(req: Request, res: Response) {
    try {
      const classId = req.params.classId as string;

      if (!classId) {
        res.status(400).json({
          success: false,
          message: "Class ID is required",
        });
        return;
      }

      const result = await adminClassService.deleteClass(classId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete class",
      });
    }
  }

  /**
   * Search classes
   */
  async searchClasses(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || "";
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const result = await adminClassService.searchClasses(query, limit);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to search classes",
      });
    }
  }

  /**
   * Export classes to CSV
   */
  async exportClassesToCSV(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || "";

      const result = await adminClassService.exportClassesToCSV({
        skip: 0,
        take: 1000,
        search: search || undefined,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=classes.csv");
      res.send(result.data);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to export classes",
      });
    }
  }
}

export default new AdminClassController();
