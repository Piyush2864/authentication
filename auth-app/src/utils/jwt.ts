import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface JwtPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying access token:", error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return null;
  }
};
