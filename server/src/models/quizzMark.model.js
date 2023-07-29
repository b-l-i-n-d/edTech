import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const quizzMarkSchema = Schema(
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
		totalQuizzes: {
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
				type: Map,
				of: [
					{
						type: Schema.Types.ObjectId,
						required: true,
					},
				],
			},
		],
		selectedAnswers: [
			{
				type: Map,
				of: [
					{
						type: Schema.Types.ObjectId,
						required: true,
					},
				],
			},
		],
	},
	{
		timestamps: true,
	}
);

quizzMarkSchema.index({ video: 1, student: 1 }, { unique: true });

// Add plugin that converts mongoose to JSON
quizzMarkSchema.plugin(toJSON);
quizzMarkSchema.plugin(paginate);

/**
 * @typedef QuizzMark
 */
const QuizzMark = model('QuizzMark', quizzMarkSchema);
export default QuizzMark;
