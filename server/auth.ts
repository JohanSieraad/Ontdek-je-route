import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "./db";
import { users, sessions, userSocialAccounts } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { User, InsertUser, InsertSession } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImageUrl?: string;
}

export class AuthService {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Generate verification token
  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Generate JWT token
  generateJWT(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  }

  // Verify JWT token
  verifyJWT(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("Email adres is al geregistreerd");
    }

    // Hash password
    const passwordHash = await this.hashPassword(userData.password);
    
    // Generate verification token
    const verificationToken = this.generateToken();

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: userData.email.toLowerCase(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
        passwordHash,
        verificationToken,
        emailVerified: false, // TODO: Implement email verification
      })
      .returning();

    return newUser;
  }

  // Login user
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.passwordHash) {
      throw new Error("Ongeldige inloggegevens");
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Ongeldige inloggegevens");
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Generate session token
    const sessionToken = this.generateToken();
    
    // Create session
    await db.insert(sessions).values({
      userId: user.id,
      token: sessionToken,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    });

    return {
      user,
      token: sessionToken,
    };
  }

  // Social login (Google, Facebook, etc.)
  async socialLogin(provider: string, providerData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    accessToken?: string;
    refreshToken?: string;
  }): Promise<{ user: User; token: string; isNewUser: boolean }> {
    // Check if social account exists
    const [existingSocial] = await db
      .select()
      .from(userSocialAccounts)
      .where(and(
        eq(userSocialAccounts.provider, provider),
        eq(userSocialAccounts.providerId, providerData.id)
      ))
      .limit(1);

    let user: User;
    let isNewUser = false;

    if (existingSocial) {
      // Get existing user
      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, existingSocial.userId))
        .limit(1);
    } else {
      // Check if user exists by email
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, providerData.email.toLowerCase()))
        .limit(1);

      if (existingUser) {
        user = existingUser;
      } else {
        // Create new user
        [user] = await db
          .insert(users)
          .values({
            email: providerData.email.toLowerCase(),
            firstName: providerData.firstName,
            lastName: providerData.lastName,
            displayName: `${providerData.firstName || ""} ${providerData.lastName || ""}`.trim(),
            profileImageUrl: providerData.profileImage,
            emailVerified: true, // Social accounts are pre-verified
          })
          .returning();
        
        isNewUser = true;
      }

      // Create social account link
      await db.insert(userSocialAccounts).values({
        userId: user.id,
        provider,
        providerId: providerData.id,
        providerEmail: providerData.email,
        accessToken: providerData.accessToken,
        refreshToken: providerData.refreshToken,
        providerData,
      });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Generate session token
    const sessionToken = this.generateToken();
    
    // Create session
    await db.insert(sessions).values({
      userId: user.id,
      token: sessionToken,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    });

    return {
      user,
      token: sessionToken,
      isNewUser,
    };
  }

  // Get user by session token
  async getUserByToken(token: string): Promise<User | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.token, token),
        // Check if session is not expired
        // Note: We'll handle expiry check in the query
      ))
      .limit(1);

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return user || null;
  }

  // Logout user
  async logout(token: string): Promise<void> {
    await db
      .delete(sessions)
      .where(eq(sessions.token, token));
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  // Clean expired sessions
  async cleanExpiredSessions(): Promise<void> {
    await db
      .delete(sessions)
      .where(eq(sessions.expiresAt, new Date()));
  }
}

export const authService = new AuthService();