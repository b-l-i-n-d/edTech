import express from 'express';
import { assignmentMarkController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { assignmentMarkValidation } from '../../validations/index.js';

const router = express.Router();

router
	.route('/')
	.post(auth(), validate(assignmentMarkValidation.createAssignmentMark), assignmentMarkController.createAssignmentMark)
	.get(auth(), validate(assignmentMarkValidation.getAssignmentMarks), assignmentMarkController.getAssignmentMarks);

router
	.route('/:assignmentMarkId')
	.get(auth(), validate(assignmentMarkValidation.getAssignmentMark), assignmentMarkController.getAssignmentMark)
	.patch(
		auth('manageAssignmentsMarks'),
		validate(assignmentMarkValidation.updateAssignmentMark),
		assignmentMarkController.updateAssignmentMark
	)
	.delete(
		auth('manageAssignmentsMarks'),
		validate(assignmentMarkValidation.deleteAssignmentMark),
		assignmentMarkController.deleteAssignmentMark
	);

export default router;

/**
 * @swagger
 * tags:
 *   name: Assignments Marks
 *   description: Assignment marks management and retrieval
 */

/**
 * @swagger
 * /assignmentMarks:
 *   post:
 *     summary: Create an assignment mark
 *     description: Logged in users can create assignment mark.
 *     tags: [Assignments Marks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignment
 *               - student
 *               - repoLink
 *               - webpageLink
 *               - status
 *               - marks
 *               - feedback
 *             properties:
 *               assignment:
 *                 type: string
 *               student:
 *                 type: string
 *               repoLink:
 *                 type: string
 *               webpageLink:
 *                 type: string
 *               status:
 *                 type: string
 *               marks:
 *                 type: number
 *               feedback:
 *                 type: string
 *             example:
 *               assignment: 60f6e9a9e13a0a3a9c4f7b1a
 *               student: 60f6e9a9e13a0a3a9c4f7b1a
 *               repoLink: http://github.com/fake/fake
 *               webpageLink: http://fake.com
 *               status: pending
 *               marks: 0
 *               feedback: fake feedback
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentMark'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get assignment marks
 *     description: Only admins can retrieve all assignments marks.
 *     tags: [Assignments Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assignmentId
 *         schema:
 *           type: string
 *         description: Assignment id
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Student id
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Assignment mark status
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
 *                     $ref: '#/components/schemas/AssignmentMark'
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
 * /assignmentMarks/{id}:
 *   get:
 *     summary: Get an assignment mark
 *     description: Logged in users can fetch only their own assignment mark information. Only admins can fetch other assignment marks.
 *     tags: [Assignments Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment mark id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AssignmentMark'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   patch:
 *     summary: Update an assignment mark
 *     description: Only admin can update assignment mark.
 *     tags: [Assignments Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment mark id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *               - status
 *               - marks
 *               - feedback
 *             properties:
 *               status:
 *                 type: string
 *               marks:
 *                 type: number
 *               feedback:
 *                 type: string
 *             example:
 *              status: published
 *              marks: 10
 *              feedback: fake feedback
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AssignmentMark'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   delete:
 *     summary: Delete an assignment mark
 *     description: Only admins can delete assignment marks.
 *     tags: [Assignments Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment mark id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
