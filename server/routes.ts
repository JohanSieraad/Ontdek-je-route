import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRouteSchema, insertRegionSchema, insertRouteStopSchema, insertAudioTrackSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Regions
  app.get("/api/regions", async (req, res) => {
    try {
      const regions = await storage.getAllRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van regio's" });
    }
  });

  app.get("/api/regions/:id", async (req, res) => {
    try {
      const region = await storage.getRegionById(req.params.id);
      if (!region) {
        return res.status(404).json({ message: "Regio niet gevonden" });
      }
      res.json(region);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van regio" });
    }
  });

  app.post("/api/regions", async (req, res) => {
    try {
      const validated = insertRegionSchema.parse(req.body);
      const region = await storage.createRegion(validated);
      res.status(201).json(region);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige regio gegevens" });
    }
  });

  // Routes
  app.get("/api/routes", async (req, res) => {
    try {
      const { regionId, popular } = req.query;
      
      let routes;
      if (regionId) {
        routes = await storage.getRoutesByRegion(regionId as string);
      } else if (popular === 'true') {
        routes = await storage.getPopularRoutes();
      } else {
        routes = await storage.getAllRoutes();
      }
      
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van routes" });
    }
  });

  app.get("/api/routes/:id", async (req, res) => {
    try {
      const route = await storage.getRouteById(req.params.id);
      if (!route) {
        return res.status(404).json({ message: "Route niet gevonden" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van route" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const validated = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validated);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige route gegevens" });
    }
  });

  // Route Stops
  app.get("/api/routes/:routeId/stops", async (req, res) => {
    try {
      const stops = await storage.getRouteStops(req.params.routeId);
      res.json(stops);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van route stops" });
    }
  });

  app.post("/api/routes/:routeId/stops", async (req, res) => {
    try {
      const validated = insertRouteStopSchema.parse({
        ...req.body,
        routeId: req.params.routeId
      });
      const stop = await storage.createRouteStop(validated);
      res.status(201).json(stop);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige stop gegevens" });
    }
  });

  // Audio Tracks
  app.get("/api/routes/:routeId/audio", async (req, res) => {
    try {
      const tracks = await storage.getAudioTracksByRoute(req.params.routeId);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van audio tracks" });
    }
  });

  app.get("/api/stops/:stopId/audio", async (req, res) => {
    try {
      const track = await storage.getAudioTrackByStop(req.params.stopId);
      if (!track) {
        return res.status(404).json({ message: "Audio track niet gevonden" });
      }
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van audio track" });
    }
  });

  app.post("/api/audio", async (req, res) => {
    try {
      const validated = insertAudioTrackSchema.parse(req.body);
      const track = await storage.createAudioTrack(validated);
      res.status(201).json(track);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige audio gegevens" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
