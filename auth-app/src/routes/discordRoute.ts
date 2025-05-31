import express from 'express';
import { discordAuthRedirect, discordAuthCallback } from '../controllers/discordController';
import { refreshAccessToken } from '../controllers/refreshTokenController';
import { logout } from '../controllers/logoutController';

const router = express.Router();

router.route('/discord').get(discordAuthRedirect);

router.route('/discord/callback').get(discordAuthCallback);

router.route('/refresh').get(refreshAccessToken);

router.route('/logout').post(logout);

export default router;
