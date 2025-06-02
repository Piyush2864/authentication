import express from 'express';
import { getUser, getUserById } from '../controllers/userController';
import { authenticateUser } from '../middlewares/auth';


const router = express.Router();

router.route('/user').get(authenticateUser, getUser);

router.route('/user/:id').get(authenticateUser, getUserById);

export default router;