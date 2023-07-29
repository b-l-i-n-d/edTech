import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const optionSchema = Schema({
	option: {
		type: String,
		required: true,
		trim: true,
	},
	isCorrect: {
		type: Boolean,
		default: false,
	},
});

const quizzSchema = Schema(
	{
		question: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
		options: {
			type: [optionSchema],
			validate: {
				validator: (options) => {
					const correctOptionsCount = options.filter((option) => option.isCorrect).length;
					return options.length >= 2 && correctOptionsCount >= 1;
				},
				message: 'At least two options are required and at least one option must be correct',
			},
		},
	},
	{
		timestamps: true,
	}
);

quizzSchema.index({ video: 1, question: 1 }, { unique: true });

// Add plugin that converts mongoose to JSON
quizzSchema.plugin(toJSON);
quizzSchema.plugin(paginate);

/**
 * @typedef Quizz
 */
const Quizz = model('Quizz', quizzSchema);
export default Quizz;
