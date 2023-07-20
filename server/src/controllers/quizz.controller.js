import httpStatus from 'http-status';
import { quizzService, quizzSetService } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const createQuizz = catchAsync(async (req, res) => {
	const quizz = await quizzService.createQuizz(req.body);
	const quizzSet = await quizzSetService.queryQuizzSets({ video: quizz.video }, {});

	if (quizzSet.totalResults === 0) {
		await quizzSetService.createQuizzSet({ video: quizz.video, quizzes: [quizz.id] });
	} else {
		await quizzSetService.updateQuizzSetById(quizzSet.results[0].id, {
			video: quizzSet.results[0].video,
			quizzes: [...quizzSet.results[0].quizzes, quizz.id],
		});
	}

	res.status(httpStatus.CREATED).send(quizz);
});

const getQuizzes = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['question', 'video']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'video:title';

	if (req.user.role !== 'admin' && !filter.video) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Only admin can get all quizzs');
	}

	const result = await quizzService.queryQuizzs(filter, options);

	if (req.user.role !== 'admin') {
		result.results = result.results.map((quizz) => {
			const quizzObject = quizz.toJSON();
			const transformedQuizz = quizzObject.options.map((option) => {
				const { isCorrect, ...rest } = option;
				return rest;
			});
			quizzObject.options = transformedQuizz;
			return quizzObject;
		});
	}

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
	const deletedQuizz = await quizzService.deleteQuizzById(req.params.quizzId);
	const quizzSet = await quizzSetService.queryQuizzSets({ video: deletedQuizz.video }, {});
	const quizzes = quizzSet.results[0].quizzes.filter((quizz) => quizz.toString() !== deletedQuizz.id);

	if (quizzes.length === 0) {
		await quizzSetService.deleteQuizzSetById(quizzSet.results[0].id);
	} else {
		await quizzSetService.updateQuizzSetById(quizzSet.results[0].id, {
			video: quizzSet.results[0].video,
			quizzes,
		});
	}

	res.status(httpStatus.NO_CONTENT).send();
});

export default { createQuizz, getQuizzes, getQuizz, updateQuizz, deleteQuizz };
