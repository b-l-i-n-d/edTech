import httpStatus from 'http-status';
import { Video } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a video
 * @param {Object} videoBody
 * @returns {Promise<Video>}
 */
const createVideo = async (videoBody) => {
	return Video.create(videoBody);
};

/**
 * Query for videos
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVideos = async (filter, options, searchValue) => {
	const videos = await Video.paginate(filter, options, searchValue);
	return videos;
};

/**
 * Get video by id
 * @param {ObjectId} id
 * @returns {Promise<Video>}
 */
const getVideoById = async (id) => {
	return Video.findById(id);
};

/**
 * Update video by id
 * @param {ObjectId} videoId
 * @param {Object} updateBody
 * @returns {Promise<Video>}
 */
const updateVideoById = async (videoId, updateBody) => {
	const video = await getVideoById(videoId);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}
	Object.assign(video, updateBody);
	await video.save();
	return video;
};

/**
 * Delete video by id
 * @param {ObjectId} videoId
 * @returns {Promise<Video>}
 */
const deleteVideoById = async (videoId) => {
	const video = await getVideoById(videoId);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}
	await video.deleteOne();
	return video;
};

export default { createVideo, queryVideos, getVideoById, updateVideoById, deleteVideoById };
