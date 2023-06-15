import httpStatus from 'http-status';
import { videoService } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const createVideo = catchAsync(async (req, res) => {
	const video = await videoService.createVideo(req.body);
	res.status(httpStatus.CREATED).send(video);
});

const getVideos = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['title', 'description']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const searchValue = pick(req.query, ['search']).search;

	const result = await videoService.queryVideos(filter, options, searchValue);
	res.send(result);
});

const getVideo = catchAsync(async (req, res) => {
	const video = await videoService.getVideoById(req.params.videoId);
	if (!video) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
	}
	res.send(video);
});

const updateVideo = catchAsync(async (req, res) => {
	const video = await videoService.updateVideoById(req.params.videoId, req.body);
	res.send(video);
});

const deleteVideo = catchAsync(async (req, res) => {
	await videoService.deleteVideoById(req.params.videoId);
	res.status(httpStatus.NO_CONTENT).send();
});

export default { createVideo, getVideos, getVideo, updateVideo, deleteVideo };
