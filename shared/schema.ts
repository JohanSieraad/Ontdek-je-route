import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regions.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertRouteStop = z.infer<typeof insertRouteStopSchema>;
export type RouteStop = typeof routeStops.$inferSelect;

export type InsertAudioTrack = z.infer<typeof insertAudioTrackSchema>;
export type AudioTrack = typeof audioTracks.$inferSelect;
