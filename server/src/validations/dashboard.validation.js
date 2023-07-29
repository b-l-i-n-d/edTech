import Joi from 'joi';
import customValidation from './custom.validation.js';

const getDashboardData = {
	query: {
		student: Joi.string().custom(customValidation.objectId),
	},
};

export default { getDashboardData };
