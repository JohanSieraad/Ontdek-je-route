import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const regions = pgTable("regions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  routeCount: integer("route_count").notNull().default(0),
  estimatedDuration: text("estimated_duration").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  regionId: varchar("region_id").notNull(),
  category: text("category").notNull(),
  rating: real("rating").notNull().default(0),
  duration: text("duration").notNull(),
  distance: text("distance").notNull(),
  imageUrl: text("image_url").notNull(),
  difficulty: text("difficulty").notNull().default("gemakkelijk"),
  isPopular: integer("is_popular").notNull().default(0),
  isUserCreated: boolean("is_user_created").notNull().default(false),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const routeStops = pgTable("route_stops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  hasAudio: integer("has_audio").notNull().default(0),
  coordinates: jsonb("coordinates"), // {lat: number, lng: number}
});

export const audioTracks = pgTable("audio_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id"),
  stopId: varchar("stop_id"),
  title: text("title").notNull(),
  duration: text("duration").notNull(),
  fileUrl: text("file_url"),
  transcript: text("transcript"),
});

// Navigation routes table for future Google Maps/Waze integration
export const navigationRoutes = pgTable("navigation_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull(),
  provider: text("provider").notNull(), // 'google', 'waze', 'openstreetmap'
  routeData: jsonb("route_data"), // Full route response from provider
  preferences: jsonb("preferences"), // {avoidHighways: boolean, avoidTolls: boolean, avoidFerries: boolean}
  estimatedDuration: integer("estimated_duration"), // in minutes
  estimatedDistance: integer("estimated_distance"), // in meters
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Route cache expiration
});

// User reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email"),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  visitDate: timestamp("visit_date"), // When they visited the route
  createdAt: timestamp("created_at").defaultNow(),
  isVerified: integer("is_verified").notNull().default(0), // 0 or 1
});

// User photos table
export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull(),
  stopId: varchar("stop_id"), // Optional - photo can be for specific stop
  reviewId: varchar("review_id"), // Optional - photo can be attached to review
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileUrl: text("file_url").notNull(),
  caption: text("caption"),
  userName: text("user_name").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  isApproved: integer("is_approved").notNull().default(0), // 0 or 1 - moderation
});

// Schema exports
export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
});

export const insertRouteStopSchema = createInsertSchema(routeStops).omit({
  id: true,
});

export const insertAudioTrackSchema = createInsertSchema(audioTracks).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true,
});

export const insertNavigationRouteSchema = createInsertSchema(navigationRoutes).omit({
  id: true,
  createdAt: true,
});



export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regions.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertRouteStop = z.infer<typeof insertRouteStopSchema>;
export type RouteStop = typeof routeStops.$inferSelect;

export type InsertAudioTrack = z.infer<typeof insertAudioTrackSchema>;
export type AudioTrack = typeof audioTracks.$inferSelect;

export type InsertNavigationRoute = z.infer<typeof insertNavigationRouteSchema>;
export type NavigationRoute = typeof navigationRoutes.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// Castle landmarks table for interactive pop-ups
export const castleLandmarks = pgTable("castle_landmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  historicalPeriod: text("historical_period").notNull(),
  builtYear: integer("built_year").notNull(),
  architecturalStyle: text("architectural_style").notNull(),
  visitDuration: text("visit_duration").notNull(),
  entryFee: text("entry_fee").notNull(),
  highlights: jsonb("highlights"), // string[]
  funFacts: jsonb("fun_facts"), // string[]
  parkingInfo: text("parking_info").notNull(),
  instagramSpots: jsonb("instagram_spots"), // string[]
  coordinates: jsonb("coordinates"), // {lat: number, lng: number}
  routeIds: jsonb("route_ids"), // string[] - which routes include this castle
});

export const insertCastleLandmarkSchema = createInsertSchema(castleLandmarks).omit({
  id: true,
});

export type InsertCastleLandmark = z.infer<typeof insertCastleLandmarkSchema>;
export type CastleLandmark = typeof castleLandmarks.$inferSelect;

// Navigation types for future implementation
export interface RoutePreferences {
  avoidHighways: boolean;
  avoidTolls: boolean;
  avoidFerries: boolean;
  preferScenic: boolean;
  transportMode: 'driving' | 'walking' | 'bicycling' | 'transit';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NavigationStep {
  instruction: string;
  distance: string;
  duration: string;
  coordinates: Coordinates[];
}

export interface NavigationResponse {
  provider: 'google' | 'waze' | 'openstreetmap';
  routes: {
    summary: string;
    duration: string;
    distance: string;
    steps: NavigationStep[];
    coordinates: Coordinates[];
  }[];
  preferences: RoutePreferences;
}
