import { Schema, model } from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';

const videoSchema = Schema(
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
		url: {
			type: String,
			required: true,
			trim: true,
		},
		thumbnail: {
			type: String,
			required: true,
			trim: true,
		},
		duration: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
videoSchema.plugin(toJSON);
videoSchema.plugin(paginate);

videoSchema.index({ title: 'text' });

/**
 * @typedef Video
 */
const Video = model('Video', videoSchema);

export default Video;
