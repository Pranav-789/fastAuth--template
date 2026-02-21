import jwt from "jsonwebtoken";
export const optionalVerifyJwt = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) {
            return next();
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        // If token is invalid or expired, just proceed as unauthenticated
        next();
    }
};
