import httpStatus from 'http-status';
import { Quizz, QuizzMark } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import userService from './user.service.js';
import videoService from './video.service.js';

/**
 * Query for quizzMarks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort options in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuizzMarks = async (filter, options) => {
	const assignmentMarks = await QuizzMark.paginate(filter, options);
	return assignmentMarks;
};

/**
 * Create a quizzMark
 * @param {Object} quizzMarkBody
 * @returns {Promise<QuizzMark>}
 */
const createQuizzMark = async (quizzMarkBody) => {
	const quizzMark = await queryQuizzMarks(
		{
			video: quizzMarkBody.video,
			student: quizzMarkBody.student,
		},
		{}
	);

	if (quizzMark.length > 0) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Quizz mark already exists');
	}

	const video = await videoService.getVideoById(quizzMarkBody.video);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}

	const student = await userService.getUserById(quizzMarkBody.student);
	if (!student) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
	}

	const quizzes = await Quizz.find({ video: quizzMarkBody.video });
	if (quizzes.length === 0) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Quizz not found');
	}

	const correctAnswers = quizzes.map((quizz) => {
		return {
			[quizz._id]: quizz.options.filter((option) => option.isCorrect).map((option) => option._id),
		};
	});

	// compare correctAnswers with quizzMarkBody.selectedAnswers
	const { selectedAnswers } = quizzMarkBody;
	let totalCorrect = 0;
	for (let i = 0; i < selectedAnswers.length; i += 1) {
		const quizz = quizzes[i];
		const selectedAnswer = selectedAnswers[i];
		const correctAnswer = correctAnswers[i][quizz._id];
		if (selectedAnswer.length === correctAnswer.length) {
			let isCorrect = true;
			for (let j = 0; j < selectedAnswer.length; j += 1) {
				if (!correctAnswer.includes(selectedAnswer[j])) {
					isCorrect = false;
					break;
				}
			}
			if (isCorrect) {
				totalCorrect += 1;
			}
		}
	}
	// for (let i = 0; i < correctAnswers.length; i += 1) {
	// 	const correctAnswer = correctAnswers[i];
	// 	const selectedAnswer = selectedAnswers.find((selectedAns) => selectedAns.quizzId === correctAnswer.quizzId);
	// 	if (selectedAnswer) {
	// 		const { correctOptions } = correctAnswer;
	// 		const { selectedOptions } = selectedAnswer;
	// 		if (correctOptions.length === selectedOptions.length) {
	// 			let isCorrect = true;
	// 			for (let j = 0; j < correctOptions.length; j += 1) {
	// 				const correctOption = correctOptions[j];
	// 				if (!selectedOptions.includes(correctOption)) {
	// 					isCorrect = false;
	// 					break;
	// 				}
	// 			}
	// 			if (isCorrect) {
	// 				totalCorrect += 1;
	// 			}
	// 		}
	// 	}
	// }

	return QuizzMark.create({
		...quizzMarkBody,
		video: video._id,
		student: student._id,
		totalQuizzes: quizzes.length,
		totalCorrect,
		totalWrong: quizzes.length - totalCorrect,
		totalMarks: quizzes.length * 5,
		marks: totalCorrect * 5,
		correctAnswers,
	});
};

export default {
	queryQuizzMarks,
	createQuizzMark,
};
