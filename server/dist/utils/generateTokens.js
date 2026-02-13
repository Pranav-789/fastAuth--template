import jwt from "jsonwebtoken";
// import dotenv from 'dotenv'
// dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, accessTokenSecret, {
        expiresIn: accessTokenExpiry,
    });
};
