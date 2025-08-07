import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { RouteCard } from "@/components/route-card";
import { CastleLandmarkTrigger } from "@/components/castle-landmark-popup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, MapPin, Clock, Car, Navigation as NavigationIcon } from "lucide-react";
import type { Route, CastleLandmark } from "@shared/schema";

export function KasteelRoutes() {
  const { data: routes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const { data: castles, isLoading: castlesLoading } = useQuery<CastleLandmark[]>({
    queryKey: ["/api/castles"],
  });

  // Filter routes that contain castle content
  const kasteelRoutes = routes?.filter(route => 
    route.category?.toLowerCase().includes('kastelen') ||
    route.title.toLowerCase().includes('kasteel') ||
    route.description.toLowerCase().includes('kasteel') ||
    route.description.toLowerCase().includes('castle')
  ) || [];

  if (routesLoading || castlesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dutch-orange"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-amber-600 to-yellow-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <Badge className="bg-white/20 text-white px-6 py-2 text-lg">
                <Crown className="h-5 w-5 mr-2" />
                Kasteel Routes Collectie
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Ontdek Historische Kastelen
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Van Muiderslot tot Kasteel De Haar - rijd langs de mooiste kastelen van Nederland en België
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6" />
                <span>{kasteelRoutes.length} Kasteel Routes</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>{castles?.length || 0} Historische Kastelen</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span>3-8 uur per route</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Castle Routes Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beschikbare Kasteel Routes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elke route brengt je langs historische kastelen, authentieke restaurants en Instagram-waardige fotoplekken
            </p>
          </div>

          {kasteelRoutes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {kasteelRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  data-testid={`card-route-${route.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-2xl border border-amber-200">
              <Crown className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Kasteel Routes Worden Geladen
              </h3>
              <p className="text-gray-500 mb-6">
                We bereiden de mooiste kasteel routes voor je voor
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/regios"}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Bekijk Alle Regio's
              </Button>
            </div>
          )}
        </section>

        {/* Featured Castles Section */}
        {castles && castles.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Historische Kastelen
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Klik op een kasteel voor gedetailleerde informatie, geschiedenis en praktische tips
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {castles.slice(0, 6).map((castle) => (
                <CastleLandmarkTrigger key={castle.id} castle={castle}>
                  <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-amber-100 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={castle.imageUrl}
                        alt={castle.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        data-testid={`img-castle-${castle.id}`}
                        onError={(e) => {
                          console.log(`Failed to load image for ${castle.name}:`, castle.imageUrl);
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-yellow-500 text-black font-semibold mb-2">
                            <Crown className="h-3 w-3 mr-1" />
                            {castle.historicalPeriod}
                          </Badge>
                          <p className="text-white text-sm line-clamp-2">
                            {castle.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {castle.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="text-sm">{castle.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{castle.visitDuration}</span>
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          <span>Parkeren mogelijk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CastleLandmarkTrigger>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-amber-500 to-yellow-400 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar voor je Kasteel Avontuur?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Kies een route en start vandaag nog je historische reis door Nederland
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-50 font-semibold px-8 py-4"
              onClick={() => window.location.href = "/regios"}
            >
              <NavigationIcon className="w-5 h-5 mr-2" />
              Start Route Planning
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
              onClick={() => window.location.href = "/"}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Terug naar Home
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}