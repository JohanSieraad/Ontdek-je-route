import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface ActivityData {
  actionType: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export function useActivityTracking() {
  const { isAuthenticated } = useAuth();

  const trackActivityMutation = useMutation({
    mutationFn: async (activity: ActivityData) => {
      // More strict validation before even making request
      if (!isAuthenticated || !activity.actionType || !activity.entityType || !activity.entityId) {
        return;
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await apiRequest("/api/activity", {
        method: "POST",
        body: JSON.stringify(activity),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    retry: false,
    onError: () => {
      // Completely silent - no logging
    },
  });

  const trackActivity = useCallback((activity: ActivityData) => {
    // Only track if user is authenticated, we have a token, mutation is not pending, and data is valid
    const token = localStorage.getItem('authToken');
    if (isAuthenticated && token && !trackActivityMutation.isPending && 
        activity.actionType && activity.entityType && activity.entityId) {
      trackActivityMutation.mutate(activity);
    }
  }, [isAuthenticated, trackActivityMutation]);

  // Convenience methods for common activities
  const trackRouteView = useCallback((routeId: string, metadata?: Record<string, any>) => {
    trackActivity({
      actionType: "view",
      entityType: "route",
      entityId: routeId,
      metadata: { ...metadata, timestamp: Date.now() }
    });
  }, [trackActivity]);

  const trackRouteSearch = useCallback((searchTerm: string, results: number) => {
    trackActivity({
      actionType: "search",
      entityType: "route",
      entityId: "search",
      metadata: { searchTerm, resultsCount: results, timestamp: Date.now() }
    });
  }, [trackActivity]);

  const trackRegionView = useCallback((regionId: string, metadata?: Record<string, any>) => {
    trackActivity({
      actionType: "view",
      entityType: "region",
      entityId: regionId,
      metadata: { ...metadata, timestamp: Date.now() }
    });
  }, [trackActivity]);

  const trackCategoryInterest = useCallback((category: string, metadata?: Record<string, any>) => {
    trackActivity({
      actionType: "view",
      entityType: "category",
      entityId: category,
      metadata: { ...metadata, timestamp: Date.now() }
    });
  }, [trackActivity]);

  const trackBookmark = useCallback((routeId: string, action: "add" | "remove") => {
    trackActivity({
      actionType: action === "add" ? "bookmark" : "unbookmark",
      entityType: "route", 
      entityId: routeId,
      metadata: { timestamp: Date.now() }
    });
  }, [trackActivity]);

  const trackShare = useCallback((routeId: string, platform: string) => {
    trackActivity({
      actionType: "share",
      entityType: "route",
      entityId: routeId,
      metadata: { platform, timestamp: Date.now() }
    });
  }, [trackActivity]);

  const trackRouteCompletion = useCallback((routeId: string, rating?: number) => {
    trackActivity({
      actionType: "complete",
      entityType: "route",
      entityId: routeId,
      metadata: { rating, timestamp: Date.now() }
    });
  }, [trackActivity]);

  return {
    trackActivity,
    trackRouteView,
    trackRouteSearch,
    trackRegionView,
    trackCategoryInterest,
    trackBookmark,
    trackShare,
    trackRouteCompletion,
    isTracking: trackActivityMutation.isPending
  };
}