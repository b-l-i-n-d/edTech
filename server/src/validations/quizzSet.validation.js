import Joi from 'joi';
import customValidation from './custom.validation.js';

const getQuizzSets = {
	params: Joi.object().keys({
		video: Joi.custom(customValidation.objectId),
	}),
};

export default {
	getQuizzSets,
};
