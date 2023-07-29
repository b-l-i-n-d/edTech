import express from 'express';
import { dashboardController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { dashboardValidation } from '../../validations/index.js';

const router = express.Router();

router.route('/').get(auth(), validate(dashboardValidation.getDashboardData), dashboardController.getDashboardData);

export default router;
