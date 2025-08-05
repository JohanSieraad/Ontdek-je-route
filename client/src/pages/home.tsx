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

      {/* Country and Region Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Kies Uw Bestemming</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ontdek historische routes in Nederland en België. Elk land biedt unieke culturele ervaringen 
              en adembenemende landschappen om te verkennen.
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
            <>
              {/* Nederlandse Regio's */}
              <div className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="w-10 h-7 mr-4 border border-gray-300 rounded-sm overflow-hidden">
                    <svg viewBox="0 0 9 6" className="w-full h-full">
                      <rect width="9" height="2" fill="#AE1C28"/>
                      <rect width="9" height="2" y="2" fill="#FFFFFF"/>
                      <rect width="9" height="2" y="4" fill="#21468B"/>
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Nederland</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regions.filter(region => !region.name.includes("Belgische")).map((region) => (
                    <RegionCard key={region.id} region={region} />
                  ))}
                </div>
              </div>

              {/* Belgische Regio's */}
              <div className="mb-8">
                <div className="flex items-center mb-8">
                  <div className="w-10 h-7 mr-4 border border-gray-300 rounded-sm overflow-hidden">
                    <svg viewBox="0 0 15 13" className="w-full h-full">
                      <rect width="5" height="13" fill="#000000"/>
                      <rect width="5" height="13" x="5" fill="#FFD700"/>
                      <rect width="5" height="13" x="10" fill="#FF0000"/>
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">België</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regions.filter(region => region.name.includes("Belgische")).map((region) => (
                    <RegionCard key={region.id} region={region} />
                  ))}
                </div>
              </div>
            </>
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
