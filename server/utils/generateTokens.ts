import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

const accessTokenSecret: Secret = process.env.ACCESS_TOKEN_SECRET as string;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
const refreshTokenSecret: Secret = process.env.REFRESH_TOKEN_SECRET as string;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"];
const verifyMailTokenSecret = process.env.VERIFY_MAIL_TOKEN_SECRET as string;
const verifyMailTokenExpiry = process.env.VERIFY_MAIL_TOKEN_EXPIRY as SignOptions["expiresIn"];
const resetPasswordTokenSecret = process.env.RESET_PASSWORD_TOKEN_SECRET as string
const resetPasswordTokenExpiry = process.env.RESET_PASSWORD_TOKEN_EXPIRY as SignOptions["expiresIn"]

export interface RefreshTokenPayload extends JwtPayload {
  sessionId: string;
  userId: number;
}

export interface AccessTokenPayload extends JwtPayload {
  userId: number;
}

export const generateAccessToken = (userId: number) => {
  return jwt.sign(
    { userId },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry }
  );
};

export const generateRefreshToken = (userId: number, sessionId: string) => {
  return jwt.sign(
    {userId, sessionId},
    refreshTokenSecret,
    {expiresIn: refreshTokenExpiry}
  )
}

export const generateVerifyMailToken = (userId: number) => {
  return jwt.sign(
    {userId},
    verifyMailTokenSecret,
    {expiresIn: verifyMailTokenExpiry}
  )
}

export const generateResetPasswwordToken = (userId: number) => {
  return jwt.sign(
    {userId},
    resetPasswordTokenSecret,
    {expiresIn: resetPasswordTokenExpiry}
  )
}