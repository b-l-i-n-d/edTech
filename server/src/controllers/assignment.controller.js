import httpStatus from 'http-status';
import { assignmentService } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const createAssignment = catchAsync(async (req, res) => {
	const assignment = await assignmentService.createAssignment(req.body);
	res.status(httpStatus.CREATED).send(assignment);
});

const getAssignments = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['title', 'video']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'video:title';

	const result = await assignmentService.queryAssignments(filter, options);
	res.send(result);
});

const getAssignment = catchAsync(async (req, res) => {
	const assignment = await assignmentService.getAssignmentById(req.params.assignmentId);
	if (!assignment) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
	}
	res.send(assignment);
});

const updateAssignment = catchAsync(async (req, res) => {
	const assignment = await assignmentService.updateAssignmentById(req.params.assignmentId, req.body);
	res.send(assignment);
});

const deleteAssignment = catchAsync(async (req, res) => {
	await assignmentService.deleteAssignmentById(req.params.assignmentId);
	res.status(httpStatus.NO_CONTENT).send();
});

export default {
	createAssignment,
	getAssignments,
	getAssignment,
	updateAssignment,
	deleteAssignment,
};
