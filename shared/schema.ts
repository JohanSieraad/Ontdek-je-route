import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb, timestamp, boolean, index, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User authentication tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  displayName: varchar("display_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"), // For email signup
  emailVerified: boolean("email_verified").default(false),
  isVerified: boolean("is_verified").default(false), // Add missing field
  verificationToken: varchar("verification_token"),
  resetToken: varchar("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences for personalized recommendations
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  preferredCategories: jsonb("preferred_categories").$type<string[]>().default([]),
  preferredDifficulty: varchar("preferred_difficulty").default("gemakkelijk"), // gemakkelijk, matig, moeilijk
  preferredDuration: varchar("preferred_duration").default("2-4 uur"), // tijd voorkeur
  preferredDistance: varchar("preferred_distance").default("50-100 km"), // afstand voorkeur  
  preferredRegions: jsonb("preferred_regions").$type<string[]>().default([]),
  interests: jsonb("interests").$type<string[]>().default([]), // kastelen, natuur, cultuur, eten, fotografie
  travelStyle: varchar("travel_style").default("relaxed"), // relaxed, adventure, cultural, family
  groupSize: integer("group_size").default(2),
  hasChildren: boolean("has_children").default(false),
  budgetRange: varchar("budget_range").default("middel"), // laag, middel, hoog
  accessibilityNeeds: jsonb("accessibility_needs").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User activity tracking for recommendation algorithm
export const userActivity = pgTable("user_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actionType: varchar("action_type").notNull(), // view, like, bookmark, complete, share, search
  entityType: varchar("entity_type").notNull(), // route, region, castle, category
  entityId: varchar("entity_id").notNull(),
  metadata: jsonb("metadata").default({}), // additional context like search terms, time spent, etc.
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("user_activity_user_idx").on(table.userId),
  index("user_activity_action_idx").on(table.actionType),
  index("user_activity_entity_idx").on(table.entityType, table.entityId),
  index("user_activity_created_idx").on(table.createdAt),
]);

// Route bookmarks/favorites
export const userBookmarks = pgTable("user_bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  routeId: varchar("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  rating: real("rating"), // user's personal rating
  notes: text("notes"), // personal notes about the route
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("user_bookmarks_user_idx").on(table.userId),
  index("user_bookmarks_route_idx").on(table.routeId),
]);

// Route recommendations cache
export const routeRecommendations = pgTable("route_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  routeId: varchar("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  score: real("score").notNull(), // recommendation confidence score (0-1)
  reason: text("reason"), // explanation why this route is recommended
  algorithmVersion: varchar("algorithm_version").default("v1.0"),
  isShown: boolean("is_shown").default(false),
  isClicked: boolean("is_clicked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(), // recommendations expire after some time
}, (table) => [
  index("route_recommendations_user_idx").on(table.userId),
  index("route_recommendations_score_idx").on(table.score),
  index("route_recommendations_expires_idx").on(table.expiresAt),
]);

export const userSocialAccounts = pgTable("user_social_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider").notNull(), // 'google', 'facebook', 'instagram'
  providerId: varchar("provider_id").notNull(), // External user ID from provider
  providerEmail: varchar("provider_email"),
  providerData: jsonb("provider_data"), // Store additional profile data
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("user_social_provider_idx").on(table.provider, table.providerId),
]);

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("session_token_idx").on(table.token),
  index("session_expires_idx").on(table.expiresAt),
]);

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
  createdBy: varchar("created_by").references(() => users.id),
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

// User favorite locations - saved points of interest
export const userFavoriteLocations = pgTable("user_favorite_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // restaurant, castle, photo_spot, gas_station, charging_station, bnb
  address: text("address").notNull(),
  coordinates: jsonb("coordinates").notNull(), // {lat: number, lng: number}
  phoneNumber: varchar("phone_number"),
  website: varchar("website"),
  openingHours: jsonb("opening_hours"), // {monday: "9:00-17:00", etc}
  priceRange: varchar("price_range"), // €, €€, €€€, €€€€
  rating: real("rating"), // personal rating
  notes: text("notes"), // personal notes
  instagramWorthy: boolean("instagram_worthy").default(false),
  evFriendly: boolean("ev_friendly").default(false), // has EV charging
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User vehicle preferences
export const userVehiclePreferences = pgTable("user_vehicle_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  vehicleType: varchar("vehicle_type").notNull(), // car, motorcycle, ev, camper, bicycle
  fuelType: varchar("fuel_type"), // petrol, diesel, electric, hybrid, hydrogen
  needsCharging: boolean("needs_charging").default(false),
  chargingType: varchar("charging_type"), // type1, type2, ccs, chademo
  tankCapacity: integer("tank_capacity"), // liters or kWh
  averageConsumption: real("average_consumption"), // l/100km or kWh/100km
  maxRange: integer("max_range"), // km on full tank/charge
  preferredBrands: jsonb("preferred_brands").$type<string[]>().default([]), // shell, bp, fastned, etc
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User completed routes - travel history
export const userCompletedRoutes = pgTable("user_completed_routes", {
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  routeId: varchar("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow(),
  duration: integer("duration"), // actual duration in minutes
  rating: real("rating"), // user's rating for this completion
  photos: jsonb("photos").$type<string[]>().default([]), // URLs to uploaded photos
  notes: text("notes"), // travel diary notes
  weatherConditions: varchar("weather_conditions"),
  travelCompanions: jsonb("travel_companions").$type<string[]>().default([]),
  favoriteStops: jsonb("favorite_stops").$type<string[]>().default([]), // stop IDs they loved most
  wouldRecommend: boolean("would_recommend").default(true),
  wouldRepeat: boolean("would_repeat").default(false),
}, (table) => [
  primaryKey({ columns: [table.userId, table.routeId] }),
  index("completed_routes_user_idx").on(table.userId),
  index("completed_routes_date_idx").on(table.completedAt),
]);

// Points of interest along routes - restaurants, castles, photo spots, etc
export const pointsOfInterest = pgTable("points_of_interest", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // restaurant, castle, photo_spot, gas_station, charging_station, bnb, museum, park
  description: text("description").notNull(),
  address: text("address").notNull(),
  coordinates: jsonb("coordinates").notNull(), // {lat: number, lng: number}
  phoneNumber: varchar("phone_number"),
  website: varchar("website"),
  instagramHandle: varchar("instagram_handle"),
  openingHours: jsonb("opening_hours"), // {monday: "9:00-17:00", etc}
  priceRange: varchar("price_range"), // €, €€, €€€, €€€€
  averageRating: real("average_rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  imageUrl: text("image_url").notNull(),
  instagramSpots: jsonb("instagram_spots").$type<string[]>().default([]), // specific photo locations
  amenities: jsonb("amenities").$type<string[]>().default([]), // wifi, parking, wheelchair_accessible, etc
  // For gas stations / charging stations
  fuelTypes: jsonb("fuel_types").$type<string[]>().default([]), // petrol, diesel, electric, etc
  chargingTypes: jsonb("charging_types").$type<string[]>().default([]), // type2, ccs, etc
  chargingSpeed: varchar("charging_speed"), // slow, fast, rapid
  // For restaurants
  cuisineTypes: jsonb("cuisine_types").$type<string[]>().default([]),
  dietaryOptions: jsonb("dietary_options").$type<string[]>().default([]), // vegetarian, vegan, gluten_free
  // For accommodation  
  accommodationType: varchar("accommodation_type"), // bnb, hotel, camping, etc
  roomTypes: jsonb("room_types").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table for routes and points of interest
export const routePointsOfInterest = pgTable("route_points_of_interest", {
  routeId: varchar("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  poiId: varchar("poi_id").notNull().references(() => pointsOfInterest.id, { onDelete: "cascade" }),
  orderInRoute: integer("order_in_route").notNull(),
  distanceFromStart: integer("distance_from_start"), // km from route start
  isOptional: boolean("is_optional").default(false),
  estimatedStopTime: integer("estimated_stop_time"), // minutes
  description: text("description"), // context for this POI on this route
}, (table) => [
  primaryKey({ columns: [table.routeId, table.poiId] }),
]);

// User authentication schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserBookmarkSchema = createInsertSchema(userBookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertUserFavoriteLocationSchema = createInsertSchema(userFavoriteLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserVehiclePreferencesSchema = createInsertSchema(userVehiclePreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCompletedRouteSchema = createInsertSchema(userCompletedRoutes).omit({
  completedAt: true,
});

export const insertPointOfInterestSchema = createInsertSchema(pointsOfInterest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User auth types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertUserBookmark = z.infer<typeof insertUserBookmarkSchema>;
export type UserBookmark = typeof userBookmarks.$inferSelect;

export type InsertUserFavoriteLocation = z.infer<typeof insertUserFavoriteLocationSchema>;
export type UserFavoriteLocation = typeof userFavoriteLocations.$inferSelect;

export type InsertUserVehiclePreferences = z.infer<typeof insertUserVehiclePreferencesSchema>;
export type UserVehiclePreferences = typeof userVehiclePreferences.$inferSelect;

export type InsertUserCompletedRoute = z.infer<typeof insertUserCompletedRouteSchema>;
export type UserCompletedRoute = typeof userCompletedRoutes.$inferSelect;

export type InsertPointOfInterest = z.infer<typeof insertPointOfInterestSchema>;
export type PointOfInterest = typeof pointsOfInterest.$inferSelect;

// Multi-day routes for extended travel experiences
export const multiDayRoutes = pgTable("multi_day_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  regionId: varchar("region_id").notNull(),
  duration: varchar("duration").notNull(), // "3 dagen", "5 dagen", etc.
  totalDistance: varchar("total_distance").notNull(),
  difficulty: varchar("difficulty").notNull(),
  priceRange: varchar("price_range").notNull(), // "€150-250 per persoon", etc.
  imageUrl: varchar("image_url"),
  category: varchar("category").notNull(),
  rating: real("rating").default(0),
  isPopular: integer("is_popular").default(0),
  affiliateCommission: real("affiliate_commission").default(0), // Expected commission percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual days within multi-day routes
export const itineraryDays = pgTable("itinerary_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  multiDayRouteId: varchar("multi_day_route_id").notNull(),
  dayNumber: integer("day_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startLocation: varchar("start_location").notNull(),
  endLocation: varchar("end_location").notNull(),
  drivingDistance: varchar("driving_distance").notNull(),
  estimatedDrivingTime: varchar("estimated_driving_time").notNull(),
  accommodationId: varchar("accommodation_id"), // Links to accommodations table
  highlights: text("highlights").array(), // Array of day highlights
  restaurants: text("restaurants").array(), // Restaurant recommendations
  attractions: text("attractions").array(), // Must-see attractions
  instagramSpots: text("instagram_spots").array(),
});

// Accommodations with affiliate integration
export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type").notNull(), // "Hotel", "B&B", "Kasteel Hotel", "Boerderij", "Apartment"
  location: varchar("location").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url"),
  pricePerNight: varchar("price_per_night").notNull(),
  rating: real("rating").default(0),
  amenities: text("amenities").array(),
  
  // Affiliate integration
  airbnbUrl: varchar("airbnb_url"),
  airbnbAffiliateCode: varchar("airbnb_affiliate_code"),
  bookingComUrl: varchar("booking_com_url"), 
  bookingComAffiliateCode: varchar("booking_com_affiliate_code"),
  
  // Location data
  coordinates: varchar("coordinates"), // JSON string with lat/lng
  address: varchar("address"),
  
  // Additional metadata
  isAuthentic: integer("is_authentic").default(1), // Dutch/Belgian authentic properties
  specialFeatures: text("special_features").array(), // "Historic castle", "Waterfront", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking tracking for affiliate revenue
export const bookingTracking = pgTable("booking_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  accommodationId: varchar("accommodation_id").notNull(),
  multiDayRouteId: varchar("multi_day_route_id"),
  platform: varchar("platform").notNull(), // "airbnb", "booking.com"
  bookingReference: varchar("booking_reference"),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  totalAmount: real("total_amount"),
  commissionAmount: real("commission_amount"),
  commissionRate: real("commission_rate"),
  bookingStatus: varchar("booking_status").default("pending"), // "pending", "confirmed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});



// Database relations for multi-day routes
export const multiDayRouteRelations = relations(multiDayRoutes, ({ many, one }) => ({
  region: one(regions, { fields: [multiDayRoutes.regionId], references: [regions.id] }),
  itineraryDays: many(itineraryDays),
  bookings: many(bookingTracking),
}));

export const itineraryDayRelations = relations(itineraryDays, ({ one }) => ({
  multiDayRoute: one(multiDayRoutes, { fields: [itineraryDays.multiDayRouteId], references: [multiDayRoutes.id] }),
  accommodation: one(accommodations, { fields: [itineraryDays.accommodationId], references: [accommodations.id] }),
}));

export const accommodationRelations = relations(accommodations, ({ many }) => ({
  itineraryDays: many(itineraryDays),
  bookings: many(bookingTracking),
}));

export const bookingTrackingRelations = relations(bookingTracking, ({ one }) => ({
  user: one(users, { fields: [bookingTracking.userId], references: [users.id] }),
  accommodation: one(accommodations, { fields: [bookingTracking.accommodationId], references: [accommodations.id] }),
  multiDayRoute: one(multiDayRoutes, { fields: [bookingTracking.multiDayRouteId], references: [multiDayRoutes.id] }),
}));

// Multi-day route schema exports
export const insertMultiDayRouteSchema = createInsertSchema(multiDayRoutes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertItineraryDaySchema = createInsertSchema(itineraryDays).omit({
  id: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
});

export const insertBookingTrackingSchema = createInsertSchema(bookingTracking).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof userSocialAccounts.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type MultiDayRoute = typeof multiDayRoutes.$inferSelect;
export type InsertMultiDayRoute = z.infer<typeof insertMultiDayRouteSchema>;
export type ItineraryDay = typeof itineraryDays.$inferSelect;
export type InsertItineraryDay = z.infer<typeof insertItineraryDaySchema>;
export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type BookingTracking = typeof bookingTracking.$inferSelect;
export type InsertBookingTracking = z.infer<typeof insertBookingTrackingSchema>;

// Additional recommendation system types
export const insertUserActivitySchema = createInsertSchema(userActivity).omit({
  id: true,
  createdAt: true,
});

export const insertRouteRecommendationSchema = createInsertSchema(routeRecommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type UserActivity = typeof userActivity.$inferSelect;

export type InsertRouteRecommendation = z.infer<typeof insertRouteRecommendationSchema>;
export type RouteRecommendation = typeof routeRecommendations.$inferSelect;

// Login/Register schemas for API
export const registerSchema = z.object({
  email: z.string().email("Ongeldig email adres"),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 karakters zijn"),
  firstName: z.string().min(2, "Voornaam is verplicht"),
  lastName: z.string().min(2, "Achternaam is verplicht"),
  displayName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Ongeldig email adres"),
  password: z.string().min(1, "Wachtwoord is verplicht"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Ongeldig email adres"),
});

export const changePasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 karakters zijn"),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

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
