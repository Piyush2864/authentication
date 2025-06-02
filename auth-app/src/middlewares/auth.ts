import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const userService = new UserService();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.accessToken;
  if (!token) {
     res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
    const user = await userService.getUserById(decoded.userId);

    if (!user) {
       res.status(404).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
     res.status(403).json({ error: "Invalid or expired token" });
  }
};
