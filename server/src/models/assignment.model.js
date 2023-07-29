import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const assignmentSchema = Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		dueDate: {
			type: Date,
			required: true,
			validator: (dueDate) => {
				return dueDate > Date.now();
			},
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
		totalMarks: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

assignmentSchema.index({ video: 1, title: 1 }, { unique: true });

// Add plugin that converts mongoose to JSON
assignmentSchema.plugin(toJSON);
assignmentSchema.plugin(paginate);

/**
 * @typedef Assignment
 */
const Assignment = model('Assignment', assignmentSchema);
export default Assignment;
