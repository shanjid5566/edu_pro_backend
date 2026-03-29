import { Router } from "express";
import adminClassScheduleController from "../controllers/adminClassScheduleController";
import { verifyToken, checkRole } from "../middleware/authMiddleware";

const router = Router();

// Middleware to protect all routes
router.use(verifyToken, checkRole(["ADMIN"]));

// Get all schedules
router.get("/", adminClassScheduleController.getAllSchedules);

// Search schedules
router.get("/search", adminClassScheduleController.searchSchedules);

// Export schedules to CSV
router.get("/export/csv", adminClassScheduleController.exportSchedulesToCSV);

// Get dropdowns
router.get("/dropdown/classes", adminClassScheduleController.getAllClasses);

router.get("/dropdown/teachers", adminClassScheduleController.getAllTeachers);

// Get schedules by class
router.get("/by-class/:classId", adminClassScheduleController.getSchedulesByClass);

// Get schedules by day
router.get("/by-day/:day", adminClassScheduleController.getSchedulesByDay);

// Get schedule by ID
router.get("/:scheduleId", adminClassScheduleController.getScheduleById);

// Create schedule
router.post("/", adminClassScheduleController.createSchedule);

// Update schedule
router.put("/:scheduleId", adminClassScheduleController.updateSchedule);

// Delete schedule
router.delete("/:scheduleId", adminClassScheduleController.deleteSchedule);

export default router;
