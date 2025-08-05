import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRouteSchema, insertRegionSchema, insertRouteStopSchema, insertAudioTrackSchema, insertReviewSchema, insertPhotoSchema, registerSchema, loginSchema } from "@shared/schema";
import { authService } from "./auth";
import { authenticateToken, optionalAuth } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validated = registerSchema.parse(req.body);
      const user = await authService.register(validated);
      
      // Remove sensitive data
      const { passwordHash, verificationToken, resetToken, ...safeUser } = user;
      
      res.status(201).json({
        message: "Account succesvol aangemaakt",
        user: safeUser,
      });
    } catch (error) {
      console.error("Registration error:", error);
      const message = error instanceof Error ? error.message : "Fout bij registratie";
      res.status(400).json({ message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validated = loginSchema.parse(req.body);
      const { user, token } = await authService.login(validated.email, validated.password);
      
      // Remove sensitive data
      const { passwordHash, verificationToken, resetToken, ...safeUser } = user;
      
      res.json({
        message: "Succesvol ingelogd",
        user: safeUser,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      const message = error instanceof Error ? error.message : "Fout bij inloggen";
      res.status(401).json({ message });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await authService.logout(token);
      }
      res.json({ message: "Succesvol uitgelogd" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Fout bij uitloggen" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await authService.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
      }
      
      // Remove sensitive data
      const { passwordHash, verificationToken, resetToken, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Fout bij ophalen gebruiker" });
    }
  });

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

  // Create a new user route (protected)
  app.post("/api/routes", authenticateToken, async (req, res) => {
    try {
      const validated = insertRouteSchema.parse({
        ...req.body,
        createdBy: req.user!.id,
        isUserCreated: true,
      });
      const route = await storage.createRoute(validated);
      res.status(201).json(route);
    } catch (error) {
      console.error("Error creating route:", error);
      res.status(400).json({ message: "Ongeldige route gegevens" });
    }
  });

  // Update an existing route (protected - only route owner)
  app.put("/api/routes/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if route exists and user owns it
      const existingRoute = await storage.getRouteById(id);
      if (!existingRoute) {
        return res.status(404).json({ message: "Route niet gevonden" });
      }
      
      if (existingRoute.createdBy !== req.user!.id) {
        return res.status(403).json({ message: "Geen toegang tot deze route" });
      }
      
      const validated = insertRouteSchema.partial().parse(req.body);
      const route = await storage.updateRoute(id, validated);
      res.json(route);
    } catch (error) {
      console.error("Error updating route:", error);
      res.status(400).json({ message: "Fout bij updaten van route" });
    }
  });

  // Delete a route (protected - only route owner)
  app.delete("/api/routes/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if route exists and user owns it
      const existingRoute = await storage.getRouteById(id);
      if (!existingRoute) {
        return res.status(404).json({ message: "Route niet gevonden" });
      }
      
      if (existingRoute.createdBy !== req.user!.id) {
        return res.status(403).json({ message: "Geen toegang tot deze route" });
      }
      
      await storage.deleteRoute(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ message: "Fout bij verwijderen van route" });
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

  // Reviews
  app.get("/api/routes/:routeId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByRoute(req.params.routeId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van reviews" });
    }
  });

  app.post("/api/routes/:routeId/reviews", async (req, res) => {
    try {
      const validated = insertReviewSchema.parse({
        ...req.body,
        routeId: req.params.routeId
      });
      const review = await storage.createReview(validated);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige review gegevens" });
    }
  });

  app.get("/api/reviews/:id", async (req, res) => {
    try {
      const review = await storage.getReviewById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: "Review niet gevonden" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van review" });
    }
  });

  // Photos
  app.get("/api/routes/:routeId/photos", async (req, res) => {
    try {
      const photos = await storage.getPhotosByRoute(req.params.routeId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van foto's" });
    }
  });

  app.get("/api/stops/:stopId/photos", async (req, res) => {
    try {
      const photos = await storage.getPhotosByStop(req.params.stopId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van foto's" });
    }
  });

  app.post("/api/routes/:routeId/photos", async (req, res) => {
    try {
      const validated = insertPhotoSchema.parse({
        ...req.body,
        routeId: req.params.routeId
      });
      const photo = await storage.createPhoto(validated);
      res.status(201).json(photo);
    } catch (error) {
      res.status(400).json({ message: "Ongeldige foto gegevens" });
    }
  });

  app.get("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhotoById(req.params.id);
      if (!photo) {
        return res.status(404).json({ message: "Foto niet gevonden" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van foto" });
    }
  });

  // Castle landmarks routes
  app.get("/api/castles", async (req, res) => {
    try {
      const castles = await storage.getAllCastleLandmarks();
      res.json(castles);
    } catch (error) {
      console.error("Error fetching castle landmarks:", error);
      res.status(500).json({ message: "Failed to fetch castle landmarks" });
    }
  });

  app.get("/api/castles/:id", async (req, res) => {
    try {
      const castle = await storage.getCastleLandmarkById(req.params.id);
      if (!castle) {
        res.status(404).json({ message: "Castle landmark not found" });
        return;
      }
      res.json(castle);
    } catch (error) {
      console.error("Error fetching castle landmark:", error);
      res.status(500).json({ message: "Failed to fetch castle landmark" });
    }
  });

  app.get("/api/routes/:routeId/castles", async (req, res) => {
    try {
      const castles = await storage.getCastleLandmarksByRoute(req.params.routeId);
      res.json(castles);
    } catch (error) {
      console.error("Error fetching route castles:", error);
      res.status(500).json({ message: "Failed to fetch route castles" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
