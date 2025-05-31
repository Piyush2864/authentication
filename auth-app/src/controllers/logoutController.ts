import { Request, Response} from 'express';
import User from '../models/userModel';


export const logout = async(req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(refreshToken) {
            // Invalidate refresh token in DB
            await User.findOneAndUpdate(
                {refreshToken},
                { $unset: { refreshToken: ""}}
            );
        }

        //Clear auth cookies
        res.clearCookie('accessToken', { httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });

        res.json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            error: "Logout failed"
        });
    }
};