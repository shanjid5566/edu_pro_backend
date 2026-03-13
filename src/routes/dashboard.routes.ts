/**
 * Dashboard Routes
 * API routes for dashboard data
 */

import { Router, Request, Response } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * @route   GET /api/v1/dashboard
 * @access  Private (Admin)
 * @desc    Get complete admin dashboard data
 */
router.get("/", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getDashboard(req, res);
});

/**
 * @route   GET /api/v1/dashboard/overview
 * @access  Private (Admin)
 * @desc    Get dashboard overview statistics
 */
router.get("/overview", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getOverview(req, res);
});

/**
 * @route   GET /api/v1/dashboard/attendance-trend
 * @access  Private (Admin)
 * @desc    Get attendance trend data for charts
 */
router.get("/attendance-trend", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getAttendanceTrend(req, res);
});

/**
 * @route   GET /api/v1/dashboard/performance
 * @access  Private (Admin)
 * @desc    Get performance by subject for charts
 */
router.get("/performance", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getPerformanceBySubject(req, res);
});

/**
 * @route   GET /api/v1/dashboard/todays-attendance
 * @access  Private (Admin)
 * @desc    Get today's attendance overview (pie chart data)
 */
router.get("/todays-attendance", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getTodaysAttendance(req, res);
});

/**
 * @route   GET /api/v1/dashboard/recent-activity
 * @access  Private (Admin)
 * @desc    Get recent activities
 * @query   limit
 */
router.get("/recent-activity", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getRecentActivity(req, res);
});

/**
 * @route   GET /api/v1/dashboard/class-statistics
 * @access  Private (Admin)
 * @desc    Get statistics for all classes
 * @query   page, pageSize
 */
router.get("/class-statistics", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getClassStatistics(req, res);
});

/**
 * @route   GET /api/v1/dashboard/teacher-performance
 * @access  Private (Admin)
 * @desc    Get teacher performance metrics
 * @query   page, pageSize
 */
router.get("/teacher-performance", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getTeacherPerformance(req, res);
});

/**
 * @route   GET /api/v1/dashboard/student-performance
 * @access  Private (Admin)
 * @desc    Get student performance metrics
 * @query   page, pageSize, classId
 */
router.get("/student-performance", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getStudentPerformance(req, res);
});

/**
 * @route   GET /api/v1/dashboard/fee-collection
 * @access  Private (Admin)
 * @desc    Get fee collection summary
 */
router.get("/fee-collection", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getFeeCollectionSummary(req, res);
});

/**
 * @route   GET /api/v1/dashboard/exam-summary
 * @access  Private (Admin)
 * @desc    Get exam summary
 */
router.get("/exam-summary", requireRole("ADMIN", "admin"), (req: Request, res: Response) => {
  dashboardController.getExamSummary(req, res);
});

router.get("/teacher", requireRole("TEACHER", "teacher"), (req: Request, res: Response) => {
  dashboardController.getTeacherDashboard(req, res);
});

export default router;
