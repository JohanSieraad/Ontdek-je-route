import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Laadpaal merken
export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  isPopular: integer("is_popular").notNull().default(0),
});

// Laadpaal producten
export const chargingStations = pgTable("charging_stations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  power: text("power").notNull(), // "11kW", "22kW"
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  features: jsonb("features"), // {smart: boolean, weatherproof: boolean, etc}
  category: text("category").notNull(), // "thuis", "bedrijf"
  isPopular: integer("is_popular").notNull().default(0),
});

// Variaties van producten (verschillende opties per laadpaal)
export const productVariations = pgTable("product_variations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chargingStationId: varchar("charging_station_id").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  description: text("description"),
});

// Lead formulier data
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  postcode: text("postcode"),
  housingSituation: text("housing_situation"), // "eigen_huis", "huur", "bedrijf"
  currentCar: text("current_car"),
  plannedCar: text("planned_car"),
  installationNeeded: integer("installation_needed").notNull().default(0),
  budget: text("budget"),
  timeframe: text("timeframe"),
  interests: jsonb("interests"), // array van product IDs
  notes: text("notes"),
  status: text("status").notNull().default("nieuw"), // "nieuw", "contact", "offerte", "afgerond"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Informatie categorieën voor de salesfunnel
export const infoCategories = pgTable("info_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

// Informatie items binnen categorieën
export const infoItems = pgTable("info_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
});

// Zod schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().optional(),
  postcode: z.string().optional(),
  housingSituation: z.string().optional(),
  currentCar: z.string().optional(),
  plannedCar: z.string().optional(),
  budget: z.string().optional(),
  timeframe: z.string().optional(),
  notes: z.string().optional(),
});

export const insertChargingStationSchema = createInsertSchema(chargingStations).omit({
  id: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
});

export const insertInfoCategorySchema = createInsertSchema(infoCategories).omit({
  id: true,
});

export const insertInfoItemSchema = createInsertSchema(infoItems).omit({
  id: true,
});

// Types
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type ChargingStation = typeof chargingStations.$inferSelect;
export type InsertChargingStation = z.infer<typeof insertChargingStationSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type InfoCategory = typeof infoCategories.$inferSelect;
export type InsertInfoCategory = z.infer<typeof insertInfoCategorySchema>;
export type InfoItem = typeof infoItems.$inferSelect;
export type InsertInfoItem = z.infer<typeof insertInfoItemSchema>;



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
