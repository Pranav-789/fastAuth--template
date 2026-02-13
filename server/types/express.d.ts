import { AccessTokenPayload } from "../utils/generateTokens";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
