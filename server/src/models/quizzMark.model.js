import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const quizzMarlSchema = Schema(
	{
		video: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
		student: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		totalQuizz: {
			type: Number,
			required: true,
			min: 0,
		},
		totalCorrect: {
			type: Number,
			required: true,
			min: 0,
		},
		totalWrong: {
			type: Number,
			required: true,
			min: 0,
		},
		totalMarks: {
			type: Number,
			required: true,
			min: 0,
		},
		marks: {
			type: Number,
			required: true,
			min: 0,
		},
		correctAnswers: [
			{
				quizzId: {
					type: Schema.Types.ObjectId,
					ref: 'Quizz',
					required: true,
				},
				correctOptions: {
					type: Schema.Types.ObjectId,
					required: true,
				},
			},
		],
		selectedAnswers: [
			{
				quizzId: {
					type: Schema.Types.ObjectId,
					ref: 'Quizz',
					required: true,
				},
				selectedOptions: {
					type: Schema.Types.ObjectId,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Add index on video and student fields
quizzMarlSchema.index({ video: 1, student: 1 });

// Add plugin that converts mongoose to JSON
quizzMarlSchema.plugin(toJSON);
quizzMarlSchema.plugin(paginate);

/**
 * @typedef QuizzMark
 */
const QuizzMark = model('QuizzMark', quizzMarlSchema);
export default QuizzMark;
