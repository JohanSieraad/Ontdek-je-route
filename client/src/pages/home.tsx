import { useEffect } from "react";
import { HeroBanner } from "@/components/hero-banner";
import { RegionCard } from "@/components/region-card";
import { RouteCard } from "@/components/route-card";
import { InteractiveMap } from "@/components/interactive-map";
import { Footer } from "@/components/footer";
import { HeaderAd, SidebarAd, ContentAd } from "@/components/ui/google-ads";
import { SocialShare } from "@/components/ui/social-share";
import { RecommendationPanel } from "@/components/recommendation-panel";
import { PreferencesForm } from "@/components/preferences-form";
import { useQuery } from "@tanstack/react-query";
import { Region, Route } from "@shared/schema";
import { Globe } from "lucide-react";

export default function Home() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
      {/* Header Advertisement */}
      <HeaderAd />
      
      <HeroBanner />

      {/* Quick Region Preview */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🚗 Kies Uw Auto Avontuur</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rijd langs kastelen, pittoreske dorpjes en toprestaurants in Nederland en België. 
              Compleet met parkeerplekken, culinaire stops en Instagram-waardige fotomomenten.
            </p>
            
            {/* Social Share for homepage */}
            <div className="mt-8 flex justify-center">
              <SocialShare 
                url="/" 
                title="AutoRoutes Nederland - Ontdek de mooiste autoroutes" 
                description="Rijd langs kastelen, pittoreske dorpjes en toprestaurants in Nederland en België"
                variant="compact"
              />
            </div>
          </div>

          {regionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full h-32 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : regions && regions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.slice(0, 4).map((region, index) => (
                <div key={region.id} className={`animate-discovery-reveal animate-discovery-delay-${Math.min(index + 1, 4)} bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow`}>
                  <div className="w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url(${region.imageUrl})` }}></div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{region.name}</h4>
                    <p className="text-sm text-gray-600">{region.routeCount} routes</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          
          <div className="text-center mt-8">
            <a 
              href="/regios" 
              className="inline-flex items-center px-6 py-3 bg-dutch-orange text-white font-medium rounded-lg hover:bg-dutch-orange/90 transition-colors"
            >
              <Globe className="h-5 w-5 mr-2" />
              Alle Regio's Bekijken
            </a>
          </div>
        </div>
      </section>

      {/* Content Advertisement between sections */}
      <ContentAd />

      {/* Featured Routes Section */}
      <section id="routes" className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-3/4">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">🏰 Populaire Autoroutes</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Ontdek onze meest gewilde autoroutes langs kastelen, mooie dorpjes en toprestaurants. 
                  Perfect voor een dagje uit met de auto!
                </p>
              </div>

              {routesLoading ? (
                <div className="grid grid-cols-1 gap-8">
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
                <div className="grid grid-cols-1 gap-8">
                  {popularRoutes.slice(0, 4).map((route, index) => (
                    <div key={route.id} className={`animate-discovery-reveal animate-discovery-delay-${Math.min(index + 1, 4)}`}>
                      <RouteCard route={route} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Geen populaire routes gevonden.</p>
                </div>
              )}
            </div>
            
            {/* Sidebar with recommendations and advertisements */}
            <div className="lg:w-1/4">
              <div className="space-y-6">
                <RecommendationPanel />
                <PreferencesForm />
                <SidebarAd />
              </div>
            </div>
          </div>
        </div>
      </section>

      <InteractiveMap />

      <Footer />
    </div>
  );
}
