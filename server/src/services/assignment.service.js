import httpStatus from 'http-status';
import { Assignment } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import videoService from './video.service.js';

/**
 * Create a assignment
 * @param {Object} assignmentBody
 * @returns {Promise<Assignment>}
 */
const createAssignment = async (assignmentBody) => {
	const video = await videoService.getVideoById(assignmentBody.videoId);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}

	return Assignment.create(assignmentBody);
};

/**
 * Query for assignments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAssignments = async (filter, options) => {
	const assignments = await Assignment.paginate(filter, options);
	return assignments;
};

/**
 * Get assignment by id
 * @param {ObjectId} id
 * @returns {Promise<Assignment>}
 */
const getAssignmentById = async (id) => {
	return Assignment.findById(id);
};

/**
 * Update assignment by id
 * @param {ObjectId} assignmentId
 * @param {Object} updateBody
 * @returns {Promise<Assignment>}
 */
const updateAssignmentById = async (assignmentId, updateBody) => {
	const assignment = await getAssignmentById(assignmentId);
	if (!assignment) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
	}

	const video = await videoService.getVideoById(updateBody.video);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}

	Object.assign(assignment, updateBody);
	await assignment.save();
	return assignment;
};

/**
 * Delete assignment by id
 * @param {ObjectId} assignmentId
 * @returns {Promise<Assignment>}
 */
const deleteAssignmentById = async (assignmentId) => {
	const assignment = await getAssignmentById(assignmentId);
	if (!assignment) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
	}
	await assignment.deleteOne();
	return assignment;
};

export default {
	createAssignment,
	queryAssignments,
	getAssignmentById,
	updateAssignmentById,
	deleteAssignmentById,
};
