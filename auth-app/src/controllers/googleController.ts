import axios from 'axios';
import { Request, Response } from 'express';
import User from '../models/userModel';
import { generateAccessTOken, generateRefreshToken } from '../utils/jwt';

export const googleAuthRedirect = (req: Request, res: Response) => {
  const redirectURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=profile email` +
    `&access_type=offline`;

  res.redirect(redirectURL);
};

export const googleAuthCallback = async(req: Request, res: Response) => {
    const {code} = req.query;

    try {
        const {data: tokenData} = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            },
        });

        const { access_token } = tokenData;

        const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        const user = await User.findByIdAndUpdate(
            {googleId: userInfo.sub},
            {
                googleId: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                avatar: userInfo.picture,
            },
            { upsert: true, new: true}
        );

        //Generate tokens
        const accessToken = generateAccessTOken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        user.refreshToken = refreshToken;
        await user.save();

        //send tokens via http only cookies
        res.cookie('accessToken', accessToken, {httpOnly: true});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});

        res.json({
            message: "Logged in successfully",
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Authentication failed'
        });
    }
};
