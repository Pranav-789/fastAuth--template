import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { AccessTokenPayload } from "../utils/generateTokens.js";

export const verfiyJwt = async(req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token missing" });
    }
    try {
        const decoded = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired access token!!"})
    }
}