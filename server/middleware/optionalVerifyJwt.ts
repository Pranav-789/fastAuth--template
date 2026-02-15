import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../utils/generateTokens.js";

export const optionalVerifyJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return next();
        }

        const decoded = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
        req.user = decoded;
        next();
    } catch (error) {
        // If token is invalid or expired, just proceed as unauthenticated
        next();
    }
};