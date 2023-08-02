const objectId = (value, helpers) => {
	if (!value.match(/^[0-9a-fA-F]{24}$/)) {
		return helpers.message('"{{#label}}" must be a valid mongo id');
	}
	return value;
};

const password = (value, helpers) => {
	if (value.length < 6) {
		return helpers.message('password must be at least 6 characters');
	}
	if (!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)) {
		return helpers.message('Password should be combination of one uppercase, one lower case, one special char.');
	}
	return value;
};

const quizzOptions = (value, helpers) => {
	const correctOptionsCount = value.filter((option) => option.isCorrect).length;
	if (value.length < 2 || correctOptionsCount < 1) {
		return helpers.message('At least two options are required and at least one option must be correct');
	}
	return value;
};

export default { objectId, password, quizzOptions };
