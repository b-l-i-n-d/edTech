import httpStatus from 'http-status';
import { assignmentMarkService } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const createAssignmentMark = catchAsync(async (req, res) => {
	const assignmentMark = await assignmentMarkService.createAssignmentMark(req.body);
	res.status(httpStatus.CREATED).send(assignmentMark);
});

const getAssignmentMarks = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['assignment', 'student', 'status']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'assignment:title totalMarks,student:name';

	if (req.user.role !== 'admin' && !filter.student) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Only admin can get all assignment marks');
	}

	const result = await assignmentMarkService.queryAssignmentMarks(filter, options);
	res.send(result);
});

const getAssignmentMark = catchAsync(async (req, res) => {
	const assignmentMark = await assignmentMarkService.getAssignmentMarkById(req.params.assignmentMarkId);
	if (!assignmentMark) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Assignment mark not found');
	}
	res.send(assignmentMark);
});

const updateAssignmentMark = catchAsync(async (req, res) => {
	const updateBody = pick(req.body, ['marks', 'feedback']);
	const assignmentMark = await assignmentMarkService.updateAssignmentMarkById(req.params.assignmentMarkId, updateBody);
	res.send(assignmentMark);
});

const deleteAssignmentMark = catchAsync(async (req, res) => {
	await assignmentMarkService.deleteAssignmentMarkById(req.params.assignmentMarkId);
	res.status(httpStatus.NO_CONTENT).send();
});

export default {
	createAssignmentMark,
	getAssignmentMarks,
	getAssignmentMark,
	updateAssignmentMark,
	deleteAssignmentMark,
};
