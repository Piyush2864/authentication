


import axios from 'axios';
import { Request, Response } from 'express';
import User from '../models/userModel';
import { generateAccessTOken, generateRefreshToken } from '../utils/jwt';

export const discordAuthRedirect = (req: Request, res: Response) => {
  const redirectURL = `https://discord.com/api/oauth2/authorize?` +
    `client_id=${process.env.DISCORD_CLIENT_ID}` +
    `&redirect_uri=${process.env.DISCORD_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=identify email`;

  res.redirect(redirectURL);
};


export const discordAuthCallback = async(req: Request, res: Response) => {
    const {code} = req.query;

    try {
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            grant_type: 'authorization_code',
            code: code as string,
            redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        });

        const tokenRes = await axios.post(
            'https://discord.com/api/oauth2/token',
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}`},
        });

        const discordUser = userRes.data;

        const user = await User.findOneAndUpdate(
            {provider: 'discord', providerId: discordUser.id},
            {
                provider: 'discord',
                providerId: discordUser.id,
                name: `${discordUser.username}#${discordUser.discriminator}`,
                avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
                email: discordUser.email,
            },

            {upsert: true, new: true}
        );

        const access = generateAccessTOken(user.id);
        const refresh = generateRefreshToken(user.id);
        user.refreshToken = refresh;
        await user.save();

        res.cookie('accessToken', access, {httpOnly: true});
        res.cookie('refreshToken', refresh, {httpOnly: true});

        res.json({
            message: "Logged in with Discord",
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Discord authentication failed'
        });
    }
};