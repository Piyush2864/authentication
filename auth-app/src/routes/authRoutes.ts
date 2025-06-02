import express from 'express';
import { handleOAuthRedirect } from '../controllers/authRedirectController';
import { handleOAuthCallback } from '../controllers/authCallbackController';
import { refreshAccessToken } from '../controllers/refreshTokenController';
import { logout } from '../controllers/logoutController';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.route('/:provider/redirect').get(handleOAuthRedirect);

router.route('/:provider/callback').get(handleOAuthCallback)

router.route('/refresh').post(refreshAccessToken);

router.route('/logout').post(authenticateUser, logout);

export default router;