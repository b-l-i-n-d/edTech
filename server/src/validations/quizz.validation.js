import Joi from 'joi';
import customValidation from './custom.validation.js';

const createQuizz = {
	body: Joi.object().keys({
		question: Joi.string().required(),
		description: Joi.string(),
		video: Joi.required().custom(customValidation.objectId),
		options: Joi.array()
			.items(
				Joi.object().keys({
					option: Joi.string().required(),
					isCorrect: Joi.boolean().required(),
				})
			)
			.min(2)
			.custom(customValidation.quizzOptions),
	}),
};

const getQuizzes = {
	query: Joi.object().keys({
		question: Joi.string(),
		video: Joi.custom(customValidation.objectId),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

const getQuizz = {
	params: Joi.object().keys({
		quizzId: Joi.required().custom(customValidation.objectId),
	}),
};

const updateQuizz = {
	params: Joi.object().keys({
		quizzId: Joi.required().custom(customValidation.objectId),
	}),
	body: Joi.object()
		.keys({
			question: Joi.string(),
			description: Joi.string(),
			video: Joi.custom(customValidation.objectId),
			options: Joi.array().items(
				Joi.object().keys({
					_id: Joi.custom(customValidation.objectId),
					option: Joi.string().required(),
					isCorrect: Joi.boolean().default(false),
				})
			),
		})
		.min(1),
};

const deleteQuizz = {
	params: Joi.object().keys({
		quizzId: Joi.required().custom(customValidation.objectId),
	}),
};

export default { createQuizz, getQuizzes, getQuizz, updateQuizz, deleteQuizz };
