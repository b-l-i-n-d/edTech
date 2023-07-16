import Joi from 'joi';
import customValidation from './custom.validation.js';

const createQuizzMark = {
	body: Joi.object().keys({
		video: Joi.required().custom(customValidation.objectId),
		student: Joi.required().custom(customValidation.objectId),
		selectedAnswers: Joi.array()
			.items(
				Joi.object().pattern(
					Joi.custom(customValidation.objectId),
					Joi.array().items(Joi.custom(customValidation.objectId))
				)
			)
			.required(),
	}),
};

const getQuizzMarks = {
	query: Joi.object().keys({
		video: Joi.custom(customValidation.objectId),
		student: Joi.custom(customValidation.objectId),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

export default { createQuizzMark, getQuizzMarks };
