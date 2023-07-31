import { Router } from 'express';
import config from '../../config/config.js';
import assignmentRoute from './assignment.route.js';
import assignmentMarkRoute from './assignmentMark.route.js';
import authRoute from './auth.route.js';
import dashboardRoute from './dashboard.route.js';
import docsRoute from './docs.route.js';
import leaderboardRoute from './leaderboard.route.js';
import quizzRoute from './quizz.route.js';
import quizzMarkRoute from './quizzMark.route.js';
import quizzSetRoute from './quizzSet.route.js';
import userRoute from './user.route.js';
import videoRoute from './video.route.js';

const router = Router();

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoute,
	},
	{
		path: '/dashboard',
		route: dashboardRoute,
	},
	{
		path: '/users',
		route: userRoute,
	},
	{
		path: '/videos',
		route: videoRoute,
	},
	{
		path: '/quizzes',
		route: quizzRoute,
	},
	{
		path: '/quizzes-marks',
		route: quizzMarkRoute,
	},
	{
		path: '/quizzes-sets',
		route: quizzSetRoute,
	},
	{
		path: '/assignments',
		route: assignmentRoute,
	},
	{
		path: '/assignments-marks',
		route: assignmentMarkRoute,
	},
	{
		path: '/leaderboard',
		route: leaderboardRoute,
	},
];

const devRoutes = [
	// routes available only in development mode
	{
		path: '/docs',
		route: docsRoute,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
	devRoutes.forEach((route) => {
		router.use(route.path, route.route);
	});
}

export default router;
