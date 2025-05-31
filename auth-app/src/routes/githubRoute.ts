import express from 'express';
import { gitAuthRedirect, gitAuthCallback } from '../controllers/githubController';
import { refreshAccessToken } from '../controllers/refreshTokenController';
import { logout } from '../controllers/logoutController';

const router = express.Router();

router.route('/github').get(gitAuthRedirect);

router.route('/github/callback').get(gitAuthCallback);

router.route('/refresh').get(refreshAccessToken);

router.route('/logout').post(logout);

export default router;
