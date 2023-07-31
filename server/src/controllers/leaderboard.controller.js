import { leaderboardServices } from '../services/index.js';
import pick from '../utils/pick.js';

const getLeaderboard = async (req, res) => {
	const query = pick(req.query, ['student']);
	const leaderboard = await leaderboardServices.queryLeaderboard(query.student);
	res.send(leaderboard);
};

export default {
	getLeaderboard,
};
