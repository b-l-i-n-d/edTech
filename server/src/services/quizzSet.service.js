import httpStatus from 'http-status';
import { QuizzSet } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import videoService from './video.service.js';

/**
 * Create a quizzSet
 * @param {Object} quizzSetBody
 * @returns {Promise<QuizzSet>}
 */
const createQuizzSet = async (quizzSetBody) => {
	const video = await videoService.getVideoById(quizzSetBody.video);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}

	return QuizzSet.create(quizzSetBody);
};

/**
 * Query for quizzSets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuizzSets = async (filter, options) => {
	const quizzSets = await QuizzSet.paginate(filter, options);

	return quizzSets;
};

/**
 * Get quizzSet by id
 * @param {ObjectId} id
 * @returns {Promise<QuizzSet>}
 */
const getQuizzSetById = async (id) => {
	return QuizzSet.findById(id);
};

/**
 * Update quizzSet by id
 * @param {ObjectId} quizzSetId
 * @param {Object} updateBody
 * @returns {Promise<QuizzSet>}
 */
const updateQuizzSetById = async (quizzSetId, updateBody) => {
	const quizzSet = await getQuizzSetById(quizzSetId);
	if (!quizzSet) {
		throw new ApiError(httpStatus.NOT_FOUND, 'QuizzSet not found');
	}

	const video = await videoService.getVideoById(updateBody.video);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}

	Object.assign(quizzSet, updateBody);
	await quizzSet.save();
	return quizzSet;
};

/**
 * Delete quizzSet by id
 * @param {ObjectId} quizzSetId
 * @returns {Promise<QuizzSet>}
 */
const deleteQuizzSetById = async (quizzSetId) => {
	const quizzSet = await getQuizzSetById(quizzSetId);
	if (!quizzSet) {
		throw new ApiError(httpStatus.NOT_FOUND, 'QuizzSet not found');
	}
	await quizzSet.deleteOne();
	return quizzSet;
};

export default {
	createQuizzSet,
	queryQuizzSets,
	getQuizzSetById,
	updateQuizzSetById,
	deleteQuizzSetById,
};
