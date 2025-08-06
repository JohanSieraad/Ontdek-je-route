import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// JWT secret - in production this should be from environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-2024-routes-app";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    displayName?: string;
  };
}

// Generate JWT token
export function generateToken(user: { id: string; email: string; displayName?: string }): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      displayName: user.displayName 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token vereist" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Ongeldig of verlopen token" });
  }

  // Verify user still exists
  const user = await storage.getUserById(decoded.id);
  if (!user) {
    return res.status(403).json({ message: "Gebruiker niet gevonden" });
  }

  req.user = {
    id: user.id,
    email: user.email!,
    displayName: user.displayName || undefined
  };

  next();
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await storage.getUserById(decoded.id);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email!,
          displayName: user.displayName || undefined
        };
      }
    }
  }

  next();
}