import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

interface AuthenticatedRequest extends Request {
    users? : any;
}

export const authenticateUser = async(req: AuthenticatedRequest, res: Response, next:NextFunction )=> {
    const token = req.cookies.accessToken;
    if(!token) {
        return res.status(401).json({
            error: "Not authenticated"
        });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)as {userId: string};
        const user = await User.findById(decoded.userId);
        if(!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            error: "Invalid or expired token"
        });
    }
};

//Protect private routes
export const requireAuth = authenticateUser;