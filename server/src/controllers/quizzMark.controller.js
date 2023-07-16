import httpStatus from 'http-status';
import { quizzMarkService } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const createQuizzMark = catchAsync(async (req, res) => {
	const quizzMark = await quizzMarkService.createQuizzMark(req.body);
	res.status(httpStatus.CREATED).send(quizzMark);
});

const getQuizzMarks = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['video', 'student']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'video:videoId title,student:name';

	if (req.user.role !== 'admin' && !filter.student) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Only admin can get all quizz marks');
	}

	const result = await quizzMarkService.queryQuizzMarks(filter, options);
	res.send(result);
});

export default {
	createQuizzMark,
	getQuizzMarks,
};
