import httpStatus from 'http-status';
import { Quizz } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a quizz
 * @param {Object} quizzBody
 * @returns {Promise<Quizz>}
 */
const createQuizz = async (quizzBody) => {
	return Quizz.create(quizzBody);
};

/**
 * Query for quizzs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuizzs = async (filter, options) => {
	const quizzs = await Quizz.paginate(filter, options);
	return quizzs;
};

/**
 * Get quizz by id
 * @param {ObjectId} id
 * @returns {Promise<Quizz>}
 */
const getQuizzById = async (id) => {
	return Quizz.findById(id);
};

/**
 * Update quizz by id
 * @param {ObjectId} quizzId
 * @param {Object} updateBody
 * @returns {Promise<Quizz>}
 */
const updateQuizzById = async (quizzId, updateBody) => {
	const quizz = await getQuizzById(quizzId);
	if (!quizz) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Quizz not found');
	}
	Object.assign(quizz, updateBody);
	await quizz.save();
	return quizz;
};

/**
 * Delete quizz by id
 * @param {ObjectId} quizzId
 * @returns {Promise<Quizz>}
 */
const deleteQuizzById = async (quizzId) => {
	const quizz = await getQuizzById(quizzId);
	if (!quizz) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Quizz not found');
	}
	await quizz.deleteOne();
	return quizz;
};

export default { createQuizz, queryQuizzs, getQuizzById, updateQuizzById, deleteQuizzById };