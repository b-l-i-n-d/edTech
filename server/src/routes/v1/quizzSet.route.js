import express from 'express';
import { quizzSetController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { quizzSetValidation } from '../../validations/index.js';

const router = express.Router();

router.route('/').get(auth(), validate(quizzSetValidation.getQuizzSets), quizzSetController.getQuizzSets);

export default router;
