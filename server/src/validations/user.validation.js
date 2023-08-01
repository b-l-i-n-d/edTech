import Joi from 'joi';
import customValidation from './custom.validation.js';

const createUser = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(customValidation.password),
		name: Joi.string().required(),
		role: Joi.string().required().valid('user', 'admin'),
	}),
};

const getUsers = {
	query: Joi.object().keys({
		name: Joi.string(),
		role: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

const getUser = {
	params: Joi.object().keys({
		userId: Joi.required().custom(customValidation.objectId),
	}),
};

const updateUser = {
	params: Joi.object().keys({
		userId: Joi.required().custom(customValidation.objectId),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(customValidation.password),
			name: Joi.string(),
			photo: Joi.string(),
			watchedVideos: Joi.array().items(Joi.string().custom(customValidation.objectId)),
		})
		.min(1),
};

const deleteUser = {
	params: Joi.object().keys({
		userId: Joi.required().custom(customValidation.objectId),
	}),
};

export default { createUser, getUsers, getUser, updateUser, deleteUser };
