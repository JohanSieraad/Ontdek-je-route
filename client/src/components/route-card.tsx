import { Link } from "wouter";
import { Route } from "@shared/schema";
import { Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RouteCardProps {
  route: Route;
}

export function RouteCard({ route }: RouteCardProps) {
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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      data-testid={`card-route-${route.id}`}
    >
      <div className="md:flex">
        <div className="md:w-1/2">
          <img 
            src={route.imageUrl} 
            alt={route.title} 
            className="w-full h-48 md:h-full object-cover"
            data-testid={`img-route-${route.id}`}
          />
        </div>
        <div className="md:w-1/2 p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge 
              className={getCategoryColor(route.category)}
              data-testid={`badge-category-${route.id}`}
            >
              {route.category}
            </Badge>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4" />
              <span className="ml-1 text-sm font-medium text-gray-700" data-testid={`text-rating-${route.id}`}>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span data-testid={`text-duration-${route.id}`}>{route.duration}</span>
              <MapPin className="ml-4 mr-1 h-4 w-4" />
              <span data-testid={`text-distance-${route.id}`}>{route.distance}</span>
            </div>
            <Link href={`/route/${route.id}`}>
              <Button 
                className="bg-gradient-to-r from-dutch-orange to-sunset-pink text-white hover:from-dutch-orange/90 hover:to-sunset-pink/90 text-sm shadow-md"
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
