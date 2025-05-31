import express from 'express';
import { googleAuthCallback, googleAuthRedirect } from '../controllers/googleController';
import { refreshAccessToken } from '../controllers/refreshTokenController';
import { logout } from '../controllers/logoutController';

const router = express.Router();

router.route('/google').get(googleAuthRedirect);

router.route('/google/callback').get(googleAuthCallback);

router.route('/refresh').get(refreshAccessToken);

router.route('/logout').post(logout);

export default router;
