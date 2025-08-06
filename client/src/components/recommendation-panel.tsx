import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { RouteRecommendation, Route } from "@shared/schema";

interface RecommendationWithRoute extends RouteRecommendation {
  route?: Route;
}

export function RecommendationPanel() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: recommendations, isLoading } = useQuery<RecommendationWithRoute[]>({
    queryKey: ["/api/recommendations"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: allRoutes } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const trackClickMutation = useMutation({
    mutationFn: async (routeId: string) => {
      await apiRequest(`/api/recommendations/${routeId}/click`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  // Enhance recommendations with route data
  const enhancedRecommendations = recommendations?.map(rec => {
    const route = allRoutes?.find(r => r.id === rec.routeId);
    return { ...rec, route };
  }).filter(rec => rec.route) || [];

  const handleRouteClick = (routeId: string) => {
    trackClickMutation.mutate(routeId);
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <CardTitle className="text-xl text-gray-800">Persoonlijke Aanbevelingen</CardTitle>
          <CardDescription className="text-gray-600">
            Log in om gepersonaliseerde route aanbevelingen te ontvangen op basis van jouw voorkeuren en interesses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
            Inloggen voor Aanbevelingen
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-amber-200">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!enhancedRecommendations.length) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Aanbevelingen worden gegenereerd...</CardTitle>
          <CardDescription className="text-gray-600">
            Blader door enkele routes om gepersonaliseerde aanbevelingen te krijgen!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-800">Aanbevolen voor jou</CardTitle>
            <CardDescription className="text-gray-600">
              Op basis van jouw voorkeuren en activiteit
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {enhancedRecommendations.slice(0, 3).map((recommendation) => {
          const { route } = recommendation;
          if (!route) return null;

          return (
            <Link
              key={recommendation.id}
              href={`/routes/${route.id}`}
              onClick={() => handleRouteClick(route.id)}
            >
              <Card 
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-amber-200 bg-white/80 backdrop-blur-sm"
                data-testid={`recommendation-card-${route.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800 truncate">{route.title}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          <span className="text-xs text-gray-600">{route.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{route.distance}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                          {route.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">
                            {Math.round(recommendation.score * 100)}% match
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {recommendation.reason}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {enhancedRecommendations.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full mt-4 border-amber-300 text-amber-700 hover:bg-amber-50"
            data-testid="view-all-recommendations"
          >
            Bekijk alle {enhancedRecommendations.length} aanbevelingen
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}