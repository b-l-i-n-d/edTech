import httpStatus from 'http-status';
import { AssignmentMark } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import assignmentService from './assignment.service.js';
import userService from './user.service.js';

/**
 * Query for assignmentMarks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort options in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAssignmentMarks = async (filter, options) => {
	const assignmentMarks = await AssignmentMark.paginate(filter, options);
	return assignmentMarks;
};

/**
 * Create a assignmentMark
 * @param {Object} assignmentMarkBody
 * @returns {Promise<AssignmentMark>}
 */
const createAssignmentMark = async (assignmentMarkBody) => {
	const assignment = await assignmentService.getAssignmentById(assignmentMarkBody.assignment);
	if (!assignment) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
	}

	const student = await userService.getUserById(assignmentMarkBody.student);
	if (!student) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
	}

	const assignmentMark = await queryAssignmentMarks(
		{
			assignment: assignmentMarkBody.assignment,
			student: assignmentMarkBody.student,
		},
		{}
	);

	if (assignmentMark.length > 0) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Assignment mark already exists');
	}

	if (new Date() > assignment.dueDate) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Assignment is overdue');
	}

	return AssignmentMark.create({
		...assignmentMarkBody,
		status: 'pending',
		marks: 0,
	});
};

/**
 * Get assignmentMark by id
 * @param {ObjectId} assignmentId
 * @returns {Promise<AssignmentMark>}
 */
const getAssignmentMarkById = async (id) => {
	return AssignmentMark.findById(id);
};

/**
 * Update assignmentMark by id
 * @param {ObjectId} assignmentMarkId
 * @param {Object} updateBody
 * @returns {Promise<AssignmentMark>}
 */
const updateAssignmentMarkById = async (assignmentMarkId, updateBody) => {
	const assignmentMark = await getAssignmentMarkById(assignmentMarkId);
	if (!assignmentMark) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment Mark not found');
	}

	const assignment = await assignmentService.getAssignmentById(assignmentMark.assignment);

	if (!assignment) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
	}

	if (updateBody.mark > assignment.totalMarks) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Mark cannot be greater than total marks');
	}

	Object.assign(assignmentMark, {
		...updateBody,
		status: 'published',
	});
	await assignmentMark.save();
	return assignmentMark;
};

/**
 * Delete assignmentMark by id
 * @param {ObjectId} assignmentMarkId
 * @returns {Promise<AssignmentMark>}
 */
const deleteAssignmentMarkById = async (assignmentMarkId) => {
	const assignmentMark = await getAssignmentMarkById(assignmentMarkId);
	if (!assignmentMark) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment Mark not found');
	}
	await assignmentMark.deleteOne();
	return assignmentMark;
};

export default {
	createAssignmentMark,
	queryAssignmentMarks,
	getAssignmentMarkById,
	updateAssignmentMarkById,
	deleteAssignmentMarkById,
};
