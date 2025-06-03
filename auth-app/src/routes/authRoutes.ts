import express from 'express';
import { handleOAuthRedirect } from '../controllers/authRedirectController.js';
import { handleOAuthCallback } from '../controllers/authCallbackController.js';
import { refreshAccessToken } from '../controllers/refreshTokenController.js';
import { logout } from '../controllers/logoutController.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = express.Router();

router.route('/:provider/redirect').get(handleOAuthRedirect);

router.route('/:provider/callback').get(handleOAuthCallback)

router.route('/refresh').post(refreshAccessToken);

router.route('/logout').post(authenticateUser, logout);

export default router;