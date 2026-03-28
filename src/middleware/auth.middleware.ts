import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const rawJwtSecret = process.env.JWT_SECRET;
if (!rawJwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}
const JWT_SECRET: string = rawJwtSecret;

/** Claims we encode in login; kept separate from `jsonwebtoken`'s JwtPayload name. */
type AuthTokenPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

// Extend Express Request type
export type AuthenticatedRequest = Request & {
  user?: AuthTokenPayload;
};

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // Read token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // Verify token (library returns string | Jwt when using certain options/overloads)
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // Attach user to request
    req.user = decoded as unknown as AuthTokenPayload;

    // Continue request
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
