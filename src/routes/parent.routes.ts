import { Router } from "express";
import { parentController } from "../controllers/parent.controller";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/parents:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Get all parents
 *     description: Retrieve list of parents with pagination and search
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Parents retrieved successfully
 */
router.get("/", verifyToken, (req, res) => parentController.getParents(req, res));

/**
 * @swagger
 * /api/v1/parents/search/{query}:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Search parents
 *     description: Search parents by name, email, or phone
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get("/search/:query", verifyToken, (req, res) => parentController.searchParents(req, res));

/**
 * @swagger
 * /api/v1/parents/stats:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Get parent statistics
 *     description: Retrieve parent statistics and summaries
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get("/stats", verifyToken, (req, res) => parentController.getStatistics(req, res));

/**
 * @swagger
 * /api/v1/parents/export:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Export parents as CSV
 *     description: Export filtered parent records
 *     security:
 *       - BearerAuth: []
 */
router.get("/export", verifyToken, (req, res) => parentController.exportParents(req, res));

/**
 * @swagger
 * /api/v1/parents/{id}:
 *   get:
 *     tags:
 *       - Parents
 *     summary: Get single parent
 *     description: Retrieve parent by ID with assigned students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     responses:
 *       200:
 *         description: Parent retrieved successfully
 *       404:
 *         description: Parent not found
 */
router.get("/:id", verifyToken, (req, res) => parentController.getParentById(req, res));

/**
 * @swagger
 * /api/v1/parents:
 *   post:
 *     tags:
 *       - Parents
 *     summary: Create new parent
 *     description: Create a new parent (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rajesh Kumar"
 *               email:
 *                 type: string
 *                 example: "rajesh.kumar@parent.edupro.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               occupation:
 *                 type: string
 *                 example: "Software Engineer"
 *               password:
 *                 type: string
 *                 example: "Parent@123"
 *     responses:
 *       201:
 *         description: Parent created successfully
 */
router.post("/", verifyToken, (req, res) => parentController.createParent(req, res));

/**
 * @swagger
 * /api/v1/parents/bulk:
 *   post:
 *     tags:
 *       - Parents
 *     summary: Bulk create parents
 *     description: Create multiple parents at once (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parents
 *             properties:
 *               parents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - email
 *                     - phone
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                     password:
 *                       type: string
 *     responses:
 *       201:
 *         description: Bulk parents created successfully
 */
router.post("/bulk", verifyToken, (req, res) => parentController.bulkCreateParents(req, res));

/**
 * @swagger
 * /api/v1/parents/{id}:
 *   put:
 *     tags:
 *       - Parents
 *     summary: Update parent
 *     description: Update parent details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               occupation:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Parent updated successfully
 *       404:
 *         description: Parent not found
 */
router.put("/:id", verifyToken, (req, res) => parentController.updateParent(req, res));

/**
 * @swagger
 * /api/v1/parents/{id}/students:
 *   post:
 *     tags:
 *       - Parents
 *     summary: Assign students to parent
 *     description: Assign multiple students to a parent (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentIds
 *             properties:
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["student_1", "student_2"]
 *     responses:
 *       200:
 *         description: Students assigned successfully
 */
router.post("/:id/students", verifyToken, (req, res) => parentController.assignStudents(req, res));

/**
 * @swagger
 * /api/v1/parents/{id}:
 *   delete:
 *     tags:
 *       - Parents
 *     summary: Delete parent
 *     description: Delete a parent (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     responses:
 *       200:
 *         description: Parent deleted successfully
 *       404:
 *         description: Parent not found
 */
router.delete("/:id", verifyToken, (req, res) => parentController.deleteParent(req, res));

export default router;
