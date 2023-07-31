import { leaderboardServices } from '../services/index.js';
import pick from '../utils/pick.js';

const getLeaderboard = async (req, res) => {
	const query = pick(req.query, ['student']);
	const leaderboard = await leaderboardServices.queryLeaderboard(query.student);

	if (req.user.role === 'admin') {
		return res.send(leaderboard.leaderboard);
	}
	return res.send({
		student: leaderboard.student,
		leaderboard: leaderboard.leaderboard.slice(0, 25),
	});
};

export default {
	getLeaderboard,
};
