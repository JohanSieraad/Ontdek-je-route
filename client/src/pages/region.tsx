import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { RouteCard } from "@/components/route-card";
import { AddRouteSection } from "@/components/add-route-section";
import { Footer } from "@/components/footer";
import { AddRouteButton } from "@/components/add-route-button";
import { useQuery } from "@tanstack/react-query";
import { Region, Route } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegionPage() {
  const { regionId } = useParams();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: region, isLoading: regionLoading } = useQuery<Region>({
    queryKey: ["/api/regions", regionId],
  });

  const { data: routes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes", regionId],
    queryFn: async () => {
      const response = await fetch(`/api/routes?regionId=${regionId}`);
      if (!response.ok) throw new Error("Failed to fetch routes");
      return response.json();
    },
    enabled: !!regionId,
  });

  if (regionLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Regio niet gevonden</h1>
            <Link href="/">
              <Button data-testid="button-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Region Header - kasteel route style met elegante overlays */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: `url(${region.imageUrl})` }}></div>
        
        {/* Elegant Gradient Overlay - kasteel route style */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        
        {/* Crown Badge - kasteel route style */}
        <div className="absolute top-6 left-6">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            🚗 <span>{region.routeCount} Routes</span>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-6 right-6">
          <Link href="/">
            <Button variant="outline" className="bg-white/90 hover:bg-white text-black border-white/50" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>
        
        {/* Main Content - kasteel route style overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" data-testid="text-region-name">
              {region.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed" data-testid="text-region-description">
              {region.description}
            </p>
            
            {/* Stats Row - kasteel route detail style */}
            <div className="flex flex-wrap items-center text-white text-lg space-x-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">🚗</span>
                <span className="font-semibold">{region.routeCount} routes beschikbaar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⏱️</span>
                <span className="font-semibold">{region.estimatedDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routes Grid - homepage style met gradient achtergrond */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🚗 Routes in {region.name}
              </h2>
              <p className="text-lg text-gray-600">
                Ontdek historische kastelen, pittoreske dorpjes en toprestaurants in deze regio
              </p>
            </div>
            <AddRouteButton 
              regionId={region.id}
              regionName={region.name}
              className="shrink-0"
            />
          </div>

          {routesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : routes && routes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Geen routes gevonden voor deze regio.</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Route Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AddRouteSection region={region} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
