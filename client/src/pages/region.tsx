import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { RouteCard } from "@/components/route-card";
import { AddRouteSection } from "@/components/add-route-section";
import { Footer } from "@/components/footer";
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
        <Navigation />
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
        <Navigation />
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
      <Navigation />
      
      {/* Region Header */}
      <section className="relative py-16 bg-gradient-to-r from-royal-blue to-purple-accent">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
             style={{ backgroundImage: `url(${region.imageUrl})` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-white/80 hover:bg-white" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar overzicht
            </Button>
          </Link>
          
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-region-name">
              {region.name}
            </h1>
            <p className="text-xl mb-6 opacity-90" data-testid="text-region-description">
              {region.description}
            </p>
            <div className="flex items-center space-x-6 text-lg">
              <div className="flex items-center">
                <span className="font-semibold mr-2">{region.routeCount}</span>
                <span>beschikbare routes</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">{region.estimatedDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Routes in {region.name}
            </h2>
            <p className="text-lg text-gray-600">
              Ontdek alle historische routes in deze regio
            </p>
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
