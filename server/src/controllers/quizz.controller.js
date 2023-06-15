import httpStatus from 'http-status';
import { quizzService } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const createQuizz = catchAsync(async (req, res) => {
	const quizz = await quizzService.createQuizz(req.body);
	res.status(httpStatus.CREATED).send(quizz);
});

const getQuizzes = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['question', 'videoId']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'video:title';
	const result = await quizzService.queryQuizzs(filter, options);
	res.send(result);
});

const getQuizz = catchAsync(async (req, res) => {
	const quizz = await quizzService.getQuizzById(req.params.quizzId);
	if (!quizz) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Quizz not found');
	}
	res.send(quizz);
});

const updateQuizz = catchAsync(async (req, res) => {
	const quizz = await quizzService.updateQuizzById(req.params.quizzId, req.body);
	res.send(quizz);
});

const deleteQuizz = catchAsync(async (req, res) => {
	await quizzService.deleteQuizzById(req.params.quizzId);
	res.status(httpStatus.NO_CONTENT).send();
});

export default { createQuizz, getQuizzes, getQuizz, updateQuizz, deleteQuizz };