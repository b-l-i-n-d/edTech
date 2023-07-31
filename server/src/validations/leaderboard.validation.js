import Joi from 'joi';
import customValidation from './custom.validation.js';

const getLeaderboard = {
	query: {
		student: Joi.required().custom(customValidation.objectId),
	},
};

export default { getLeaderboard };
