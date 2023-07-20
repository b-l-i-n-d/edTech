import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const quizzSetSchema = new Schema(
	{
		video: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
		quizzes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Quizz',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

quizzSetSchema.index({ video: 1, quizzes: 1 }, { unique: true });

// Add plugin that converts mongoose to JSON
quizzSetSchema.plugin(toJSON);
quizzSetSchema.plugin(paginate);

/**
 * @typedef QuizzSet
 */
const QuizzSet = model('QuizzSet', quizzSetSchema);
export default QuizzSet;
