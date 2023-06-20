import Joi from 'joi';
import customValidation from './custom.validation.js';

const createAssignmentMark = {
	body: Joi.object().keys({
		assignment: Joi.required().custom(customValidation.objectId),
		student: Joi.required().custom(customValidation.objectId),
		repoLink: Joi.string().required(),
		webpageLink: Joi.string().required(),
	}),
};

const getAssignmentMarks = {
	query: Joi.object().keys({
		assignment: Joi.custom(customValidation.objectId),
		student: Joi.custom(customValidation.objectId),
		status: Joi.string().valid('pending', 'published'),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

const getAssignmentMark = {
	params: Joi.object().keys({
		assignmentMarkId: Joi.required().custom(customValidation.objectId),
	}),
};

const updateAssignmentMark = {
	params: Joi.object().keys({
		assignmentMarkId: Joi.required().custom(customValidation.objectId),
	}),
	body: Joi.object()
		.keys({
			marks: Joi.number().min(0),
			feedback: Joi.string(),
		})
		.min(1),
};

const deleteAssignmentMark = {
	params: Joi.object().keys({
		assignmentMarkId: Joi.required().custom(customValidation.objectId),
	}),
};

export default { createAssignmentMark, getAssignmentMarks, getAssignmentMark, updateAssignmentMark, deleteAssignmentMark };
