import type { Express } from "express";
import { storage } from "../storage";
import { recommendationEngine } from "../recommendation-engine";
import { authenticateToken } from "../auth";
import { insertUserPreferencesSchema, insertUserActivitySchema, insertUserBookmarkSchema } from "@shared/schema";

export function registerRecommendationRoutes(app: Express) {
  
  // Get personalized route recommendations
  app.get("/api/recommendations", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Check for cached recommendations first
      let recommendations = await storage.getUserRecommendations(userId, 10);
      
      if (recommendations.length === 0) {
        // Generate new recommendations
        const [
          preferences,
          recentActivity,
          bookmarks,
          allRoutes
        ] = await Promise.all([
          storage.getUserPreferences(userId),
          storage.getUserActivity(userId, 20),
          storage.getUserBookmarks(userId),
          storage.getAllRoutes()
        ]);
        
        const user = await storage.getUserById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const recommendationScores = await recommendationEngine.generateRecommendations({
          user,
          preferences,
          recentActivity,
          bookmarks,
          allRoutes
        });
        
        // Save recommendations to cache
        const recommendationRecords = recommendationEngine.createRecommendationRecords(
          userId,
          recommendationScores,
          allRoutes
        );
        
        recommendations = await storage.createRecommendations(recommendationRecords);
      }
      
      // Mark recommendations as shown
      for (const rec of recommendations) {
        await storage.markRecommendationShown(userId, rec.routeId);
      }
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });
  
  // Track user preferences
  app.post("/api/preferences", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = insertUserPreferencesSchema.parse({
        ...req.body,
        userId
      });
      
      // Check if preferences exist
      const existingPreferences = await storage.getUserPreferences(userId);
      
      let result;
      if (existingPreferences) {
        result = await storage.updateUserPreferences(userId, preferences);
      } else {
        result = await storage.createUserPreferences(preferences);
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ message: "Failed to save preferences" });
    }
  });
  
  // Get user preferences
  app.get("/api/preferences", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        // Return default preferences
        return res.json({
          preferredCategories: [],
          preferredDifficulty: "gemakkelijk",
          preferredDuration: "2-4 uur",
          preferredDistance: "50-100 km",
          preferredRegions: [],
          interests: [],
          travelStyle: "relaxed",
          groupSize: 2,
          hasChildren: false,
          budgetRange: "middel",
          accessibilityNeeds: []
        });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error("Error getting preferences:", error);
      res.status(500).json({ message: "Failed to get preferences" });
    }
  });
  
  // Track user activity for recommendations
  app.post("/api/activity", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.userId;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Validate required fields - be more flexible
      const { actionType, entityType, entityId } = req.body;
      if (!actionType && !entityType) {
        // Just ignore invalid tracking requests instead of throwing errors
        return res.json({ message: "Activity tracking skipped - insufficient data" });
      }

      const activity = insertUserActivitySchema.parse({
        ...req.body,
        userId,
        sessionId: req.sessionID || 'anonymous',
        ipAddress: req.ip || '0.0.0.0',
        userAgent: req.get('User-Agent') || 'unknown'
      });
      
      const result = await storage.trackUserActivity(activity);
      res.json(result);
    } catch (error) {
      console.error("Error tracking activity:", error);
      res.status(500).json({ message: "Failed to track activity" });
    }
  });
  
  // Add route to bookmarks
  app.post("/api/bookmarks", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { routeId, notes, rating } = req.body;
      
      // Check if already bookmarked
      const isBookmarked = await storage.isRouteBookmarked(userId, routeId);
      if (isBookmarked) {
        return res.status(409).json({ message: "Route already bookmarked" });
      }
      
      const bookmark = insertUserBookmarkSchema.parse({
        userId,
        routeId,
        notes,
        rating,
        isCompleted: false
      });
      
      const result = await storage.createBookmark(bookmark);
      res.json(result);
    } catch (error) {
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Failed to bookmark route" });
    }
  });
  
  // Remove route from bookmarks
  app.delete("/api/bookmarks/:routeId", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { routeId } = req.params;
      
      await storage.removeBookmark(userId, routeId);
      res.json({ message: "Bookmark removed successfully" });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      res.status(500).json({ message: "Failed to remove bookmark" });
    }
  });
  
  // Get user bookmarks
  app.get("/api/bookmarks", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });
  
  // Mark recommendation as clicked
  app.post("/api/recommendations/:routeId/click", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { routeId } = req.params;
      
      await storage.markRecommendationClicked(userId, routeId);
      
      // Track this as user activity too
      await storage.trackUserActivity({
        userId,
        actionType: "click_recommendation",
        entityType: "route",
        entityId: routeId,
        metadata: { source: "recommendations_api" },
        sessionId: req.sessionID,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json({ message: "Click tracked successfully" });
    } catch (error) {
      console.error("Error tracking recommendation click:", error);
      res.status(500).json({ message: "Failed to track click" });
    }
  });
  
  // Get user activity history
  app.get("/api/activity", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const actionType = req.query.actionType as string;
      
      let activity;
      if (actionType) {
        activity = await storage.getUserActivityByType(userId, actionType, limit);
      } else {
        activity = await storage.getUserActivity(userId, limit);
      }
      
      res.json(activity);
    } catch (error) {
      console.error("Error getting activity:", error);
      res.status(500).json({ message: "Failed to get activity" });
    }
  });
}