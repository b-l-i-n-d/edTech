import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const assignmentMarkSchema = Schema(
	{
		assignment: {
			type: Schema.Types.ObjectId,
			ref: 'Assignment',
			required: true,
		},
		student: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		repoLink: {
			type: String,
			required: true,
			trim: true,
		},
		webpageLink: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ['pending', 'published'],
			default: 'pending',
		},
		marks: {
			type: Number,
			default: 0,
		},
		feedback: {
			type: String,
			trim: true,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

assignmentMarkSchema.index({ assignment: 1, student: 1, status: 1 }, { unique: true });

// Add plugin that converts mongoose to JSON
assignmentMarkSchema.plugin(toJSON);
assignmentMarkSchema.plugin(paginate);

/**
 * @typedef AssignmentMark
 */
const AssignmentMark = model('AssignmentMark', assignmentMarkSchema);
export default AssignmentMark;
