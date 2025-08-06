import { Link } from "wouter";
import { Route } from "@shared/schema";
import { Clock, MapPin, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CastleLandmarkTrigger } from "./castle-landmark-popup";
import { useQuery } from "@tanstack/react-query";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import { useEffect } from "react";

interface RouteCardProps {
  route: Route;
  showButton?: boolean;
}

export function RouteCard({ route, showButton = true }: RouteCardProps) {
  const { trackRouteView, trackCategoryInterest } = useActivityTracking();

  // Fetch castle landmarks for this route
  const { data: castles = [] } = useQuery({
    queryKey: ['/api/routes', route.id, 'castles'],
    queryFn: () => fetch(`/api/routes/${route.id}/castles`).then(res => res.json())
  });

  // Track route view when component mounts or when route changes
  useEffect(() => {
    trackRouteView(route.id, { 
      category: route.category, 
      region: route.regionId,
      source: 'route_card'
    });
    trackCategoryInterest(route.category);
  }, [route.id, route.category, route.regionId, trackRouteView, trackCategoryInterest]);
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kastelen & eten':
      case 'kastelen & cultuur':
        return 'bg-gradient-to-r from-purple-accent to-royal-blue text-white';
      case 'dorpjes & fotografie':
      case 'natuur & fotografie':
        return 'bg-gradient-to-r from-forest-green to-dutch-orange text-white';
      case 'bier & cultuur':
      case 'eten & cultuur':
        return 'bg-gradient-to-r from-dutch-orange to-sunset-pink text-white';
      case 'strand & restaurants':
        return 'bg-gradient-to-r from-royal-blue to-forest-green text-white';
      case 'eilanden & zee':
        return 'bg-gradient-to-r from-royal-blue to-purple-accent text-white';
      case 'nederlandse cultuur':
        return 'bg-gradient-to-r from-dutch-orange to-royal-blue text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-2 group"
      data-testid={`card-route-${route.id}`}
    >
      <div className="md:flex">
        <div className="md:w-1/2 relative overflow-hidden">
          <img 
            src={route.imageUrl} 
            alt={route.title} 
            className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
            data-testid={`img-route-${route.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="md:w-1/2 p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge 
              className={`${getCategoryColor(route.category)} transform group-hover:scale-110 transition-transform duration-200 shadow-md`}
              data-testid={`badge-category-${route.id}`}
            >
              {route.category}
            </Badge>
            <div className="flex items-center text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200">
              <Star className="h-4 w-4 group-hover:animate-pulse" />
              <span className="ml-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200" data-testid={`text-rating-${route.id}`}>
                {route.rating}
              </span>
            </div>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3" data-testid={`text-title-${route.id}`}>
            {route.title}
          </h4>
          <p className="text-gray-600 mb-4" data-testid={`text-description-${route.id}`}>
            {route.description}
          </p>
          {/* Castle landmarks badges */}
          {castles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {castles.slice(0, 2).map((castle: any) => (
                <CastleLandmarkTrigger key={castle.id} castle={castle}>
                  <Badge 
                    variant="outline" 
                    className="bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100 cursor-pointer transition-colors duration-200 flex items-center gap-1 interactive-hover"
                    data-testid={`badge-castle-${castle.id}`}
                  >
                    <Crown className="h-3 w-3" />
                    {castle.name.replace('Kasteel ', '')}
                  </Badge>
                </CastleLandmarkTrigger>
              ))}
              {castles.length > 2 && (
                <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-600">
                  +{castles.length - 2} meer
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span data-testid={`text-duration-${route.id}`}>{route.duration}</span>
              <MapPin className="ml-4 mr-1 h-4 w-4" />
              <span data-testid={`text-distance-${route.id}`}>{route.distance}</span>
            </div>
            <Link href={`/route/${route.id}`}>
              <Button 
                className="bg-gradient-to-r from-dutch-orange to-sunset-pink text-white hover:from-dutch-orange/90 hover:to-sunset-pink/90 text-sm shadow-md transform hover:scale-105 transition-all duration-200 hover:shadow-lg animate-bounce-subtle group-hover:animate-none"
                data-testid={`button-start-route-${route.id}`}
              >
                🚗 Start Autoroute
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
