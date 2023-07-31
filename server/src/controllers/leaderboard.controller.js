import httpStatus from 'http-status';
import { leaderboardServices } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import pick from '../utils/pick.js';

const getLeaderboard = async (req, res) => {
	const query = pick(req.query, ['student']);
	const leaderboard = await leaderboardServices.queryLeaderboard(query.student);

	if (req.user.role !== 'admin' && !query.student) {
		return ApiError(httpStatus.BAD_REQUEST, 'Only admin can get all leaderboard');
	}

	res.send(leaderboard);
};

export default {
	getLeaderboard,
};
