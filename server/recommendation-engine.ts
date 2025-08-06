import { 
  type Route, 
  type UserPreferences, 
  type UserActivity, 
  type UserBookmark,
  type RouteRecommendation,
  type InsertRouteRecommendation,
  type User
} from "@shared/schema";

interface RecommendationContext {
  user: User;
  preferences?: UserPreferences;
  recentActivity: UserActivity[];
  bookmarks: UserBookmark[];
  allRoutes: Route[];
}

interface RecommendationScore {
  routeId: string;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  
  /**
   * Generate personalized route recommendations for a user
   */
  async generateRecommendations(context: RecommendationContext): Promise<RecommendationScore[]> {
    const { user, preferences, recentActivity, bookmarks, allRoutes } = context;
    
    const scores: RecommendationScore[] = [];
    
    for (const route of allRoutes) {
      // Skip already bookmarked routes
      if (bookmarks.some(bookmark => bookmark.routeId === route.id)) {
        continue;
      }
      
      const score = await this.calculateRouteScore(route, context);
      scores.push(score);
    }
    
    // Sort by score descending and return top recommendations
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 recommendations
  }
  
  /**
   * Calculate recommendation score for a specific route
   */
  private async calculateRouteScore(route: Route, context: RecommendationContext): Promise<RecommendationScore> {
    const { preferences, recentActivity } = context;
    
    let score = 0;
    const reasons: string[] = [];
    
    // Base popularity score (20% weight)
    score += route.rating * 0.2;
    if (route.rating >= 4.5) {
      reasons.push("Hoog beoordeelde route");
    }
    
    // Category preference matching (30% weight)
    if (preferences?.preferredCategories?.includes(route.category)) {
      score += 0.3;
      reasons.push(`Past bij uw interesse in ${route.category}`);
    }
    
    // Duration preference matching (20% weight)
    if (preferences?.preferredDuration) {
      const durationMatch = this.matchDuration(route.duration, preferences.preferredDuration);
      score += durationMatch * 0.2;
      if (durationMatch > 0.7) {
        reasons.push("Ideale duur voor uw voorkeur");
      }
    }
    
    // Region preference matching (15% weight)
    if (preferences?.preferredRegions?.includes(route.regionId)) {
      score += 0.15;
      reasons.push("In uw favoriete regio");
    }
    
    // Travel style matching (10% weight)
    const styleScore = this.matchTravelStyle(route, preferences?.travelStyle || "relaxed");
    score += styleScore * 0.1;
    if (styleScore > 0.7) {
      reasons.push("Past bij uw reisstijl");
    }
    
    // Recent activity patterns (5% weight)
    const activityBoost = this.calculateActivityBoost(route, recentActivity);
    score += activityBoost * 0.05;
    if (activityBoost > 0.5) {
      reasons.push("Vergelijkbaar met recent bekeken routes");
    }
    
    // Seasonal and trending boost
    const seasonalBoost = this.getSeasonalBoost(route);
    score += seasonalBoost;
    if (seasonalBoost > 0) {
      reasons.push("Populair dit seizoen");
    }
    
    // Ensure score is between 0 and 1
    score = Math.min(1, Math.max(0, score));
    
    return {
      routeId: route.id,
      score,
      reasons
    };
  }
  
  /**
   * Match duration preferences with route duration
   */
  private matchDuration(routeDuration: string, preferredDuration: string): number {
    const durationRanges = {
      "1-2 uur": { min: 1, max: 2 },
      "2-4 uur": { min: 2, max: 4 },
      "4-6 uur": { min: 4, max: 6 },
      "6-8 uur": { min: 6, max: 8 },
      "hele dag": { min: 8, max: 12 }
    };
    
    const routeRange = durationRanges[routeDuration as keyof typeof durationRanges];
    const preferredRange = durationRanges[preferredDuration as keyof typeof durationRanges];
    
    if (!routeRange || !preferredRange) return 0.5; // Default moderate match
    
    // Calculate overlap between ranges
    const overlapStart = Math.max(routeRange.min, preferredRange.min);
    const overlapEnd = Math.min(routeRange.max, preferredRange.max);
    const overlap = Math.max(0, overlapEnd - overlapStart);
    
    const unionStart = Math.min(routeRange.min, preferredRange.min);
    const unionEnd = Math.max(routeRange.max, preferredRange.max);
    const union = unionEnd - unionStart;
    
    return overlap / union; // Jaccard similarity
  }
  
  /**
   * Match travel style with route characteristics
   */
  private matchTravelStyle(route: Route, travelStyle: string): number {
    const styleMatching: Record<string, Record<string, number>> = {
      "relaxed": {
        "Kastelen & Eten": 0.9,
        "Dorpjes & Fotografie": 0.8,
        "Strand & Restaurants": 0.9,
        "Nederlandse Cultuur": 0.7
      },
      "adventure": {
        "Bier & Cultuur": 0.8,
        "Eilanden & Zee": 0.9,
        "Natuur & Fotografie": 0.8
      },
      "cultural": {
        "Kastelen & Eten": 0.9,
        "Nederlandse Cultuur": 1.0,
        "Bier & Cultuur": 0.8
      },
      "family": {
        "Dorpjes & Fotografie": 0.9,
        "Kastelen & Eten": 0.8,
        "Strand & Restaurants": 0.9
      }
    };
    
    return styleMatching[travelStyle]?.[route.category] || 0.5;
  }
  
  /**
   * Calculate activity-based boost for routes similar to recently viewed
   */
  private calculateActivityBoost(route: Route, recentActivity: UserActivity[]): number {
    const recentViews = recentActivity
      .filter(activity => activity.actionType === 'view' && activity.entityType === 'route')
      .slice(0, 10); // Last 10 route views
    
    if (recentViews.length === 0) return 0;
    
    let totalSimilarity = 0;
    for (const view of recentViews) {
      // This would ideally compare route characteristics
      // For now, we'll use a simple category-based similarity
      totalSimilarity += view.entityId === route.id ? 0 : 0.3; // Avoid recommending same route
    }
    
    return totalSimilarity / recentViews.length;
  }
  
  /**
   * Get seasonal boost for routes based on current time of year
   */
  private getSeasonalBoost(route: Route): number {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    // Spring (March-May): Nature and photography routes
    if (month >= 2 && month <= 4) {
      if (route.category.includes("Fotografie") || route.category.includes("Natuur")) {
        return 0.1;
      }
    }
    
    // Summer (June-August): Beach and outdoor routes
    if (month >= 5 && month <= 7) {
      if (route.category.includes("Strand") || route.category.includes("Eilanden")) {
        return 0.15;
      }
    }
    
    // Fall (September-November): Castle and cultural routes
    if (month >= 8 && month <= 10) {
      if (route.category.includes("Kastelen") || route.category.includes("Cultuur")) {
        return 0.1;
      }
    }
    
    // Winter (December-February): Indoor cultural experiences
    if (month >= 11 || month <= 1) {
      if (route.category.includes("Cultuur") || route.category.includes("Eten")) {
        return 0.1;
      }
    }
    
    return 0;
  }
  
  /**
   * Generate recommendation reasons in Dutch
   */
  generateRecommendationReason(score: RecommendationScore, route: Route): string {
    if (score.reasons.length === 0) {
      return "Aanbevolen op basis van uw profiel";
    }
    
    if (score.reasons.length === 1) {
      return score.reasons[0];
    }
    
    if (score.reasons.length === 2) {
      return score.reasons.join(" en ");
    }
    
    return score.reasons.slice(0, -1).join(", ") + " en " + score.reasons[score.reasons.length - 1];
  }
  
  /**
   * Create recommendation records for storage
   */
  createRecommendationRecords(
    userId: string, 
    scores: RecommendationScore[], 
    routes: Route[]
  ): InsertRouteRecommendation[] {
    const routeMap = new Map(routes.map(route => [route.id, route]));
    
    return scores.map(score => {
      const route = routeMap.get(score.routeId);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Recommendations expire in 24 hours
      
      return {
        userId,
        routeId: score.routeId,
        score: score.score,
        reason: route ? this.generateRecommendationReason(score, route) : "Aanbevolen route",
        algorithmVersion: "v1.0",
        expiresAt,
        isShown: false,
        isClicked: false
      };
    });
  }
}

export const recommendationEngine = new RecommendationEngine();