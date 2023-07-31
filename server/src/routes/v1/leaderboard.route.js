import express from 'express';
import { leaderboardController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { leaderboardValidation } from '../../validations/index.js';

const router = express.Router();

router.route('/').get(auth(), validate(leaderboardValidation.getLeaderboard), leaderboardController.getLeaderboard);

export default router;
