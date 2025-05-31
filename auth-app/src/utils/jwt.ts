import jwt from 'jsonwebtoken';

export const generateAccessTOken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({userId}, process.env.JWT_REFRESH_SECRET!, {expiresIn: "7d"})
};

export const verifyAccessToken = (token:string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {userId: string};
        return decoded.userId;
    } catch (error) {
        console.error('Error in verifying access token', error);
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
        return decoded.userId;
    } catch (error) {
        console.error('Error in verifying refresh token', error);
    }
};