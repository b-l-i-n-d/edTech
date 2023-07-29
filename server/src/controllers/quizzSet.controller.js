import { quizzSetService } from '../services/index.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const getQuizzSets = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['video']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'video:title,quizzes';

	const result = await quizzSetService.queryQuizzSets(filter, options);

	if (req.user.role !== 'admin') {
		result.results = result.results.map((quizzSet) => {
			const quizzSetObject = quizzSet.toJSON();
			const transformedQuizzes = quizzSetObject.quizzes.map((quizz) => {
				const quizzObject = quizz;
				const transformedQuizz = quizzObject.options.map((option) => {
					const { isCorrect, ...rest } = option;
					return rest;
				});
				quizzObject.options = transformedQuizz;
				return quizzObject;
			});
			quizzSetObject.quizzes = transformedQuizzes;
			return quizzSetObject;
		});
	}

	res.send(result);
});

export default {
	getQuizzSets,
};
