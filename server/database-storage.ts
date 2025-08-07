import { 
  type Region, type InsertRegion, 
  type Route, type InsertRoute, 
  type RouteStop, type InsertRouteStop, 
  type AudioTrack, type InsertAudioTrack, 
  type Review, type InsertReview, 
  type Photo, type InsertPhoto, 
  type CastleLandmark, type InsertCastleLandmark, 
  type MultiDayRoute, type InsertMultiDayRoute, 
  type ItineraryDay, type InsertItineraryDay, 
  type Accommodation, type InsertAccommodation, 
  type BookingTracking, type InsertBookingTracking,
  type User, type InsertUser,
  type SocialAccount, type InsertSocialAccount,
  type Session, type InsertSession,
  type UserPreferences, type InsertUserPreferences,
  type UserActivity, type InsertUserActivity,
  type UserBookmark, type InsertUserBookmark,
  type RouteRecommendation, type InsertRouteRecommendation,
  type UserFavoriteLocation, type InsertUserFavoriteLocation,
  type UserVehiclePreferences, type InsertUserVehiclePreferences,
  type UserCompletedRoute, type InsertUserCompletedRoute,
  type PointOfInterest, type InsertPointOfInterest,
  routes, regions, routeStops, audioTracks, reviews, photos, castleLandmarks, users, userSocialAccounts, sessions,
  userPreferences, userActivity, userBookmarks, routeRecommendations, userFavoriteLocations, userVehiclePreferences,
  userCompletedRoutes, pointsOfInterest
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User Profile Data
  async getUserProfile(userId: string): Promise<{
    completedRoutes: UserCompletedRoute[];
    favoriteLocations: UserFavoriteLocation[];
    bookmarkedRoutes: UserBookmark[];
    vehiclePreferences: UserVehiclePreferences | null;
    stats: {
      totalRoutes: number;
      totalDistance: number;
      favoriteCategory: string;
    };
  }> {
    const [completedRoutes, favoriteLocations, bookmarkedRoutes, vehiclePreferences] = await Promise.all([
      this.getUserCompletedRoutes(userId),
      this.getUserFavoriteLocations(userId),
      this.getUserBookmarks(userId),
      this.getUserVehiclePreferences(userId)
    ]);

    // Calculate stats
    const totalRoutes = completedRoutes.length;
    const totalDistance = 0; // Would need to calculate from route data
    const favoriteCategory = "Kastelen & Eten"; // Would need to calculate from activity

    return {
      completedRoutes,
      favoriteLocations,
      bookmarkedRoutes,
      vehiclePreferences,
      stats: {
        totalRoutes,
        totalDistance,
        favoriteCategory
      }
    };
  }

  // User Vehicle Preferences
  async getUserVehiclePreferences(userId: string): Promise<UserVehiclePreferences | null> {
    const [preference] = await db
      .select()
      .from(userVehiclePreferences)
      .where(eq(userVehiclePreferences.userId, userId));
    
    return preference || null;
  }

  async upsertUserVehiclePreferences(preferences: InsertUserVehiclePreferences): Promise<UserVehiclePreferences> {
    const [result] = await db
      .insert(userVehiclePreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userVehiclePreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    return result;
  }

  // User Favorite Locations
  async getUserFavoriteLocations(userId: string): Promise<UserFavoriteLocation[]> {
    return await db
      .select()
      .from(userFavoriteLocations)
      .where(eq(userFavoriteLocations.userId, userId))
      .orderBy(desc(userFavoriteLocations.createdAt));
  }

  async createUserFavoriteLocation(location: InsertUserFavoriteLocation): Promise<UserFavoriteLocation> {
    const [result] = await db
      .insert(userFavoriteLocations)
      .values(location)
      .returning();
    
    return result;
  }

  async updateUserFavoriteLocation(id: string, location: Partial<InsertUserFavoriteLocation>): Promise<UserFavoriteLocation> {
    const [result] = await db
      .update(userFavoriteLocations)
      .set({ ...location, updatedAt: new Date() })
      .where(eq(userFavoriteLocations.id, id))
      .returning();
    
    return result;
  }

  async deleteUserFavoriteLocation(id: string): Promise<void> {
    await db
      .delete(userFavoriteLocations)
      .where(eq(userFavoriteLocations.id, id));
  }

  // User Completed Routes
  async getUserCompletedRoutes(userId: string): Promise<UserCompletedRoute[]> {
    return await db
      .select()
      .from(userCompletedRoutes)
      .where(eq(userCompletedRoutes.userId, userId))
      .orderBy(desc(userCompletedRoutes.completedAt));
  }

  async markRouteCompleted(completion: InsertUserCompletedRoute): Promise<UserCompletedRoute> {
    const [result] = await db
      .insert(userCompletedRoutes)
      .values(completion)
      .onConflictDoUpdate({
        target: [userCompletedRoutes.userId, userCompletedRoutes.routeId],
        set: {
          ...completion,
          completedAt: new Date(),
        },
      })
      .returning();
    
    return result;
  }

  async updateCompletedRoute(userId: string, routeId: string, updates: Partial<InsertUserCompletedRoute>): Promise<UserCompletedRoute> {
    const [result] = await db
      .update(userCompletedRoutes)
      .set(updates)
      .where(and(
        eq(userCompletedRoutes.userId, userId),
        eq(userCompletedRoutes.routeId, routeId)
      ))
      .returning();
    
    return result;
  }

  // Points of Interest
  async getAllPointsOfInterest(): Promise<PointOfInterest[]> {
    return await db.select().from(pointsOfInterest);
  }

  async getPointsOfInterestByCategory(category: string): Promise<PointOfInterest[]> {
    return await db
      .select()
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.category, category));
  }

  async getPointsOfInterestByRoute(routeId: string): Promise<PointOfInterest[]> {
    // This would need to join with routePointsOfInterest table
    return [];
  }

  async createPointOfInterest(poi: InsertPointOfInterest): Promise<PointOfInterest> {
    const [result] = await db
      .insert(pointsOfInterest)
      .values(poi)
      .returning();
    
    return result;
  }

  // ========== EXISTING IMPLEMENTATIONS ==========
  // (These would need to be copied from your existing DatabaseStorage implementation)
  
  // Regions
  async getAllRegions(): Promise<Region[]> {
    return await db.select().from(regions);
  }

  async getRegionById(id: string): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.id, id));
    return region;
  }

  async createRegion(region: InsertRegion): Promise<Region> {
    const [result] = await db.insert(regions).values(region).returning();
    return result;
  }

  // Routes
  async getAllRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async getRouteById(id: string): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route;
  }

  async getRoutesByRegion(regionId: string): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.regionId, regionId));
  }

  async getPopularRoutes(): Promise<Route[]> {
    return await db.select().from(routes).limit(10);
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const [result] = await db.insert(routes).values(route).returning();
    return result;
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route> {
    const [result] = await db
      .update(routes)
      .set(route)
      .where(eq(routes.id, id))
      .returning();
    return result;
  }

  async deleteRoute(id: string): Promise<void> {
    await db.delete(routes).where(eq(routes.id, id));
  }

  // Route Stops
  async getRouteStops(routeId: string): Promise<RouteStop[]> {
    return await db.select().from(routeStops).where(eq(routeStops.routeId, routeId));
  }

  async createRouteStop(stop: InsertRouteStop): Promise<RouteStop> {
    const [result] = await db.insert(routeStops).values(stop).returning();
    return result;
  }

  // Audio Tracks
  async getAudioTracksByRoute(routeId: string): Promise<AudioTrack[]> {
    return await db.select().from(audioTracks).where(eq(audioTracks.routeId, routeId));
  }

  async getAudioTrackByStop(stopId: string): Promise<AudioTrack | undefined> {
    const [track] = await db.select().from(audioTracks).where(eq(audioTracks.stopId, stopId));
    return track;
  }

  async createAudioTrack(track: InsertAudioTrack): Promise<AudioTrack> {
    const [result] = await db.insert(audioTracks).values(track).returning();
    return result;
  }

  // Reviews
  async getReviewsByRoute(routeId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.routeId, routeId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [result] = await db.insert(reviews).values(review).returning();
    return result;
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  // Photos
  async getPhotosByRoute(routeId: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.routeId, routeId));
  }

  async getPhotosByStop(stopId: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.stopId, stopId));
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [result] = await db.insert(photos).values(photo).returning();
    return result;
  }

  async getPhotoById(id: string): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  // Castle Landmarks
  async getAllCastleLandmarks(): Promise<CastleLandmark[]> {
    return await db.select().from(castleLandmarks);
  }

  async getCastleLandmarkById(id: string): Promise<CastleLandmark | undefined> {
    const [landmark] = await db.select().from(castleLandmarks).where(eq(castleLandmarks.id, id));
    return landmark;
  }

  async getCastleLandmarksByRoute(routeId: string): Promise<CastleLandmark[]> {
    return await db.select().from(castleLandmarks);
  }

  async createCastleLandmark(castle: InsertCastleLandmark): Promise<CastleLandmark> {
    const [result] = await db.insert(castleLandmarks).values(castle).returning();
    return result;
  }

  // Multi-day Routes
  async getAllMultiDayRoutes(): Promise<MultiDayRoute[]> {
    return [];
  }

  async getMultiDayRouteById(id: string): Promise<MultiDayRoute | undefined> {
    return undefined;
  }

  async getMultiDayRoutesByRegion(regionId: string): Promise<MultiDayRoute[]> {
    return [];
  }

  async createMultiDayRoute(route: InsertMultiDayRoute): Promise<MultiDayRoute> {
    throw new Error("Not implemented");
  }

  // Itinerary Days
  async getItineraryDaysByRoute(multiDayRouteId: string): Promise<ItineraryDay[]> {
    return [];
  }

  async getItineraryDayById(id: string): Promise<ItineraryDay | undefined> {
    return undefined;
  }

  async createItineraryDay(day: InsertItineraryDay): Promise<ItineraryDay> {
    throw new Error("Not implemented");
  }

  // Accommodations
  async getAllAccommodations(): Promise<Accommodation[]> {
    return [];
  }

  async getAccommodationById(id: string): Promise<Accommodation | undefined> {
    return undefined;
  }

  async getAccommodationsByLocation(location: string): Promise<Accommodation[]> {
    return [];
  }

  async createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation> {
    throw new Error("Not implemented");
  }

  // Booking Tracking
  async createBookingTracking(booking: InsertBookingTracking): Promise<BookingTracking> {
    throw new Error("Not implemented");
  }

  async getBookingsByUser(userId: string): Promise<BookingTracking[]> {
    return [];
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    // Not implemented
  }

  // User Authentication
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const [result] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Social Accounts
  async getSocialAccountByProvider(userId: string, provider: string): Promise<SocialAccount | undefined> {
    const [account] = await db
      .select()
      .from(userSocialAccounts)
      .where(and(
        eq(userSocialAccounts.userId, userId),
        eq(userSocialAccounts.provider, provider)
      ));
    return account;
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [result] = await db.insert(userSocialAccounts).values(account).returning();
    return result;
  }

  async updateSocialAccount(id: string, account: Partial<InsertSocialAccount>): Promise<SocialAccount> {
    const [result] = await db
      .update(userSocialAccounts)
      .set(account)
      .where(eq(userSocialAccounts.id, id))
      .returning();
    return result;
  }

  // Sessions
  async createSession(session: InsertSession): Promise<Session> {
    const [result] = await db.insert(sessions).values(session).returning();
    return result;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.token, token));
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async deleteExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(sql`${sessions.expiresAt} < NOW()`);
  }

  // User preferences for recommendations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [result] = await db.insert(userPreferences).values(preferences).returning();
    return result;
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const [result] = await db
      .update(userPreferences)
      .set({ ...preferences, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return result;
  }

  // User activity tracking
  async trackUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const [result] = await db.insert(userActivity).values(activity).returning();
    return result;
  }

  async getUserActivity(userId: string, limit?: number): Promise<UserActivity[]> {
    let query = db
      .select()
      .from(userActivity)
      .where(eq(userActivity.userId, userId))
      .orderBy(desc(userActivity.createdAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  async getUserActivityByType(userId: string, actionType: string, limit?: number): Promise<UserActivity[]> {
    let query = db
      .select()
      .from(userActivity)
      .where(and(
        eq(userActivity.userId, userId),
        eq(userActivity.actionType, actionType)
      ))
      .orderBy(desc(userActivity.createdAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  // User bookmarks/favorites
  async createBookmark(bookmark: InsertUserBookmark): Promise<UserBookmark> {
    const [result] = await db.insert(userBookmarks).values(bookmark).returning();
    return result;
  }

  async getUserBookmarks(userId: string): Promise<UserBookmark[]> {
    return await db
      .select()
      .from(userBookmarks)
      .where(eq(userBookmarks.userId, userId))
      .orderBy(desc(userBookmarks.createdAt));
  }

  async removeBookmark(userId: string, routeId: string): Promise<void> {
    await db
      .delete(userBookmarks)
      .where(and(
        eq(userBookmarks.userId, userId),
        eq(userBookmarks.routeId, routeId)
      ));
  }

  async isRouteBookmarked(userId: string, routeId: string): Promise<boolean> {
    const [bookmark] = await db
      .select()
      .from(userBookmarks)
      .where(and(
        eq(userBookmarks.userId, userId),
        eq(userBookmarks.routeId, routeId)
      ));
    return !!bookmark;
  }

  // Route recommendations
  async createRecommendations(recommendations: InsertRouteRecommendation[]): Promise<RouteRecommendation[]> {
    if (recommendations.length === 0) return [];
    
    const result = await db.insert(routeRecommendations).values(recommendations).returning();
    return result;
  }

  async getUserRecommendations(userId: string, limit?: number): Promise<RouteRecommendation[]> {
    let query = db
      .select()
      .from(routeRecommendations)
      .where(eq(routeRecommendations.userId, userId))
      .orderBy(desc(routeRecommendations.score));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  async markRecommendationShown(userId: string, routeId: string): Promise<void> {
    await db
      .update(routeRecommendations)
      .set({ wasShown: true, shownAt: new Date() })
      .where(and(
        eq(routeRecommendations.userId, userId),
        eq(routeRecommendations.routeId, routeId)
      ));
  }

  async markRecommendationClicked(userId: string, routeId: string): Promise<void> {
    await db
      .update(routeRecommendations)
      .set({ wasClicked: true, clickedAt: new Date() })
      .where(and(
        eq(routeRecommendations.userId, userId),
        eq(routeRecommendations.routeId, routeId)
      ));
  }

  async cleanupExpiredRecommendations(): Promise<void> {
    await db
      .delete(routeRecommendations)
      .where(sql`${routeRecommendations.createdAt} < NOW() - INTERVAL '30 days'`);
  }
}