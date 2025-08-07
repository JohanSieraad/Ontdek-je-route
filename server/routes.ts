import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerRecommendationRoutes } from "./routes/recommendations";
import { insertRouteSchema, insertRegionSchema, insertRouteStopSchema, insertAudioTrackSchema, insertReviewSchema, insertPhotoSchema, registerSchema, loginSchema } from "@shared/schema";
import { authenticateToken, optionalAuth, generateToken } from "./auth";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validated = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validated.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email adres is al in gebruik" });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(validated.password, 12);
      
      // Create user
      const user = await storage.createUser({
        email: validated.email,
        displayName: validated.displayName,
        firstName: validated.firstName,
        lastName: validated.lastName,
        passwordHash,
        isVerified: true, // Auto-verify for now
      });
      
      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email!,
        displayName: user.displayName || undefined
      });
      
      // Remove sensitive data
      const { passwordHash: _, verificationToken, resetToken, ...safeUser } = user;
      
      res.status(201).json({
        message: "Account succesvol aangemaakt",
        user: safeUser,
        token,
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
      
      // Find user by email
      const user = await storage.getUserByEmail(validated.email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Ongeldige inloggegevens" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Ongeldige inloggegevens" });
      }
      
      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email!,
        displayName: user.displayName || undefined
      });
      
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
      // For JWT, logout is handled client-side by removing the token
      // In a more complex setup, you could blacklist tokens here
      res.json({ message: "Succesvol uitgelogd" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Fout bij uitloggen" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user!.id);
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

  // Multi-day routes API
  app.get("/api/multi-day-routes", async (req, res) => {
    try {
      const routes = await storage.getAllMultiDayRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching multi-day routes:", error);
      res.status(500).json({ message: "Failed to fetch multi-day routes" });
    }
  });

  app.get("/api/multi-day-routes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const route = await storage.getMultiDayRouteById(id);
      if (!route) {
        return res.status(404).json({ message: "Multi-day route not found" });
      }
      res.json(route);
    } catch (error) {
      console.error("Error fetching multi-day route:", error);
      res.status(500).json({ message: "Failed to fetch multi-day route" });
    }
  });

  app.get("/api/regions/:regionId/multi-day-routes", async (req, res) => {
    try {
      const { regionId } = req.params;
      const routes = await storage.getMultiDayRoutesByRegion(regionId);
      res.json(routes);
    } catch (error) {
      console.error("Error fetching multi-day routes for region:", error);
      res.status(500).json({ message: "Failed to fetch multi-day routes for region" });
    }
  });

  // Itinerary days API
  app.get("/api/multi-day-routes/:routeId/itinerary", async (req, res) => {
    try {
      const { routeId } = req.params;
      const days = await storage.getItineraryDaysByRoute(routeId);
      res.json(days);
    } catch (error) {
      console.error("Error fetching itinerary days:", error);
      res.status(500).json({ message: "Failed to fetch itinerary days" });
    }
  });

  // Accommodations API
  app.get("/api/accommodations", async (req, res) => {
    try {
      const { location } = req.query;
      let accommodations;
      if (location) {
        accommodations = await storage.getAccommodationsByLocation(location as string);
      } else {
        accommodations = await storage.getAllAccommodations();
      }
      res.json(accommodations);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      res.status(500).json({ message: "Failed to fetch accommodations" });
    }
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const accommodation = await storage.getAccommodationById(id);
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.json(accommodation);
    } catch (error) {
      console.error("Error fetching accommodation:", error);
      res.status(500).json({ message: "Failed to fetch accommodation" });
    }
  });

  // Booking tracking API (requires authentication for user-specific operations)
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = req.body;
      const userId = req.user?.id || null; // Optional user ID for tracking
      const booking = await storage.createBookingTracking({
        ...bookingData,
        userId,
      });
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/my", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.id;
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateBookingStatus(id, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Register recommendation routes
  registerRecommendationRoutes(app);

  // User Profile Routes
  app.get("/api/profile", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.userId;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found in token" });
      }
      
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Vehicle Preferences Routes
  app.post("/api/profile/vehicle", authenticateToken, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id || req.userId;
      const vehicleData = { ...req.body, userId };
      
      const preferences = await storage.upsertUserVehiclePreferences(vehicleData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating vehicle preferences:", error);
      res.status(500).json({ message: "Failed to update vehicle preferences" });
    }
  });

  app.get("/api/profile/vehicle", authenticateToken, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id || req.userId;
      const preferences = await storage.getUserVehiclePreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching vehicle preferences:", error);
      res.status(500).json({ message: "Failed to fetch vehicle preferences" });
    }
  });

  // Favorite Locations Routes
  app.get("/api/profile/favorite-locations", authenticateToken, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id || req.userId;
      const locations = await storage.getUserFavoriteLocations(userId);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching favorite locations:", error);
      res.status(500).json({ message: "Failed to fetch favorite locations" });
    }
  });

  app.post("/api/profile/favorite-locations", authenticateToken, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id || req.userId;
      const locationData = { ...req.body, userId };
      
      const location = await storage.createUserFavoriteLocation(locationData);
      res.json(location);
    } catch (error) {
      console.error("Error creating favorite location:", error);
      res.status(500).json({ message: "Failed to create favorite location" });
    }
  });

  app.put("/api/profile/favorite-locations/:id", authenticateToken, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const location = await storage.updateUserFavoriteLocation(id, req.body);
      res.json(location);
    } catch (error) {
      console.error("Error updating favorite location:", error);
      res.status(500).json({ message: "Failed to update favorite location" });
    }
  });

  app.delete("/api/profile/favorite-locations/:id", authenticateToken, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteUserFavoriteLocation(id);
      res.json({ message: "Favorite location deleted" });
    } catch (error) {
      console.error("Error deleting favorite location:", error);
      res.status(500).json({ message: "Failed to delete favorite location" });
    }
  });

  // Completed Routes
  app.get("/api/profile/completed-routes", authenticateToken, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id || req.userId;
      const completedRoutes = await storage.getUserCompletedRoutes(userId);
      res.json(completedRoutes);
    } catch (error) {
      console.error("Error fetching completed routes:", error);
      res.status(500).json({ message: "Failed to fetch completed routes" });
    }
  });

  app.post("/api/profile/completed-routes", authenticateToken, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id || req.userId;
      const completionData = { ...req.body, userId };
      
      const completion = await storage.markRouteCompleted(completionData);
      res.json(completion);
    } catch (error) {
      console.error("Error marking route completed:", error);
      res.status(500).json({ message: "Failed to mark route completed" });
    }
  });

  // Points of Interest Routes
  app.get("/api/points-of-interest", async (req: Request, res: Response) => {
    try {
      const { category, routeId } = req.query;
      
      let pois;
      if (category) {
        pois = await storage.getPointsOfInterestByCategory(category as string);
      } else if (routeId) {
        pois = await storage.getPointsOfInterestByRoute(routeId as string);
      } else {
        pois = await storage.getAllPointsOfInterest();
      }
      
      res.json(pois);
    } catch (error) {
      console.error("Error fetching points of interest:", error);
      res.status(500).json({ message: "Failed to fetch points of interest" });
    }
  });

  // Config endpoint for client-side configuration
  app.get('/api/config', (req, res) => {
    res.json({
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
