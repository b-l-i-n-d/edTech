import Joi from 'joi';
import customValidation from './custom.validation.js';

const createVideo = {
	body: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		url: Joi.string().required(),
		thumbnail: Joi.string().required(),
		duration: Joi.number().required(),
	}),
};

const getVideos = {
	query: Joi.object().keys({
		title: Joi.string(),
		description: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
		search: Joi.string(),
	}),
};

const getVideo = {
	params: Joi.object().keys({
		videoId: Joi.required().custom(customValidation.objectId),
	}),
};

const updateVideo = {
	params: Joi.object().keys({
		videoId: Joi.required().custom(customValidation.objectId),
	}),
	body: Joi.object()
		.keys({
			title: Joi.string(),
			description: Joi.string(),
			url: Joi.string(),
			thumbnail: Joi.string(),
			duration: Joi.number(),
		})
		.min(1),
};

const deleteVideo = {
	params: Joi.object().keys({
		videoId: Joi.required().custom(customValidation.objectId),
	}),
};

export default { createVideo, getVideos, getVideo, updateVideo, deleteVideo };
