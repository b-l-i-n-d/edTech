import express from 'express';
import { assignmentController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { assignmentValidation } from '../../validations/index.js';

const router = express.Router();

router
	.route('/')
	.post(auth('manageAssignments'), validate(assignmentValidation.createAssignment), assignmentController.createAssignment)
	.get(auth(), validate(assignmentValidation.getAssignments), assignmentController.getAssignments);

router
	.route('/:assignmentId')
	.get(auth(), validate(assignmentValidation.getAssignment), assignmentController.getAssignment)
	.patch(auth('manageAssignments'), validate(assignmentValidation.updateAssignment), assignmentController.updateAssignment)
	.delete(
		auth('manageAssignments'),
		validate(assignmentValidation.deleteAssignment),
		assignmentController.deleteAssignment
	);

export default router;

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management and retrieval
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create an assignment
 *     description: Only admins can create other assignments.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - video
 *               - dueDate
 *               - totalMarks
 *             properties:
 *               title:
 *                 type: string
 *               video:
 *                 type: string
 *               dueDate:
 *                 type: date
 *               totalMarks:
 *                 type: number
 *             example:
 *               title: Assignment 1
 *               videoId: 5ebac31d9a8bdc1764d0e6b0
 *               dueDate: 2020-05-12T00:00:00.000Z
 *               totalMarks: 10
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all assignments
 *     description: Only admins can retrieve all assignments.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Assignment title
 *       - in: query
 *         name: videoId
 *         schema:
 *           type: string
 *         description: Video id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of assignments
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get an assignment
 *     description: Logged in users can fetch only their own assignment information. Only admins can fetch other assignments.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   patch:
 *     summary: Update an assignment
 *     description: Logged in assignments can only update their own information. Only admins can update other assignments.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - video
 *               - dueDate
 *               - totalMarks
 *             properties:
 *               title:
 *                 type: string
 *               video:
 *                 type: string
 *               dueDate:
 *                 type: date
 *               totalMarks:
 *                 type: number
 *             example:
 *               title: Assignment 1
 *               videoId: 5ebac31d9a8bdc1764d0e6b0
 *               dueDate: 2020-05-12T00:00:00.000Z
 *               totalMarks: 10
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an assignment
 *     description: Logged in assignments can delete only themselves. Only admins can delete other assignments.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
