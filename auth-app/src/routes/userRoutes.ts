import express from 'express';
import { getUser, getUserById } from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/auth.js';


const router = express.Router();

router.route('/user').get(authenticateUser, getUser);

router.route('/user/:id').get(authenticateUser, getUserById);

export default router;