import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { RegionCard } from "@/components/region-card";
import { RouteCard } from "@/components/route-card";
import { InteractiveMap } from "@/components/interactive-map";
import { Footer } from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Region, Route } from "@shared/schema";

export default function Home() {
  const { data: regions, isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const { data: popularRoutes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
    queryFn: async () => {
      const response = await fetch("/api/routes?popular=true");
      if (!response.ok) throw new Error("Failed to fetch popular routes");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <HeroSection />

      {/* Region Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Kies Uw Regio</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nederland is verdeeld in 12 provincies, elk met zijn eigen unieke geschiedenis en cultuur. 
              Selecteer een regio om de beschikbare historische routes te ontdekken.
            </p>
          </div>

          {regionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : regions && regions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Geen regio's gevonden.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Routes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Populaire Routes</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ontdek onze meest populaire historische routes die bezoekers uit heel Nederland aantrekken.
            </p>
          </div>

          {routesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="md:flex">
                    <div className="md:w-1/2 h-48 md:h-full bg-gray-300"></div>
                    <div className="md:w-1/2 p-6">
                      <div className="h-6 bg-gray-300 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : popularRoutes && popularRoutes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {popularRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Geen populaire routes gevonden.</p>
            </div>
          )}
        </div>
      </section>

      <InteractiveMap />

      <Footer />
    </div>
  );
}
