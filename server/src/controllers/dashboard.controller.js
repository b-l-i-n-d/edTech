import { dashboardService } from '../services/index.js';
import pick from '../utils/pick.js';

const getDashboardData = async (req, res) => {
	const query = pick(req.query, ['student']);
	const dashboard = await dashboardService.queryDashboard(query.student);
	res.send(dashboard);
};

export default {
	getDashboardData,
};
