import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || "1d";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
