"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminClassScheduleController_1 = __importDefault(require("../controllers/adminClassScheduleController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Middleware to protect all routes
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.checkRole)(["ADMIN"]));
// Get all schedules
router.get("/", adminClassScheduleController_1.default.getAllSchedules);
// Search schedules
router.get("/search", adminClassScheduleController_1.default.searchSchedules);
// Export schedules to CSV
router.get("/export/csv", adminClassScheduleController_1.default.exportSchedulesToCSV);
// Get dropdowns
router.get("/dropdown/classes", adminClassScheduleController_1.default.getAllClasses);
router.get("/dropdown/teachers", adminClassScheduleController_1.default.getAllTeachers);
// Get schedules by class
router.get("/by-class/:classId", adminClassScheduleController_1.default.getSchedulesByClass);
// Get schedules by day
router.get("/by-day/:day", adminClassScheduleController_1.default.getSchedulesByDay);
// Get schedule by ID
router.get("/:scheduleId", adminClassScheduleController_1.default.getScheduleById);
// Create schedule
router.post("/", adminClassScheduleController_1.default.createSchedule);
// Update schedule
router.put("/:scheduleId", adminClassScheduleController_1.default.updateSchedule);
// Delete schedule
router.delete("/:scheduleId", adminClassScheduleController_1.default.deleteSchedule);
exports.default = router;
