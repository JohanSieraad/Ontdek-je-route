import { Request, Response, NextFunction } from "express";
import { authService } from "../auth";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
        profileImageUrl?: string;
      };
    }
  }
}

// Middleware to check authentication
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const user = await authService.getUserByToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      displayName: user.displayName || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
}

// Optional auth middleware - doesn't throw error if no token
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await authService.getUserByToken(token);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          displayName: user.displayName || undefined,
          profileImageUrl: user.profileImageUrl || undefined,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}