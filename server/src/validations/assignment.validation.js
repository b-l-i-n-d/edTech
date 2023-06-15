import Joi from 'joi';
import customValidation from './custom.validation.js';

const createAssignment = {
	body: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string(),
		dueDate: Joi.date().required(),
		video: Joi.string().custom(customValidation.objectId),
		totalMarks: Joi.number().required(),
	}),
};

const getAssignments = {
	query: Joi.object().keys({
		title: Joi.string(),
		videoId: Joi.string().custom(customValidation.objectId),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

const getAssignment = {
	params: Joi.object().keys({
		assignmentId: Joi.string().custom(customValidation.objectId),
	}),
};

const updateAssignment = {
	params: Joi.object().keys({
		assignmentId: Joi.string().custom(customValidation.objectId),
	}),
	body: Joi.object()
		.keys({
			title: Joi.string(),
			description: Joi.string(),
			dueDate: Joi.date(),
			video: Joi.string().custom(customValidation.objectId),
			totalMarks: Joi.number(),
		})
		.min(1),
};

const deleteAssignment = {
	params: Joi.object().keys({
		assignmentId: Joi.string().custom(customValidation.objectId),
	}),
};

export default { createAssignment, getAssignments, getAssignment, updateAssignment, deleteAssignment };
