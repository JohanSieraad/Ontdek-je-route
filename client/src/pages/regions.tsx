import { useEffect } from "react";
import { RegionCard } from "@/components/region-card";
import { Footer } from "@/components/footer";
import { HeaderAd, SidebarAd, ContentAd } from "@/components/ui/google-ads";
import { SocialShare } from "@/components/ui/social-share";
import { useQuery } from "@tanstack/react-query";
import { Region } from "@shared/schema";

export default function Regions() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: regions, isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Advertisement */}
      <HeaderAd />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🚗 Alle Regio's</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek alle beschikbare regio's voor uw auto avontuur. Van Nederlandse kastelen tot Belgische Ardennen - 
              elk gebied biedt unieke routes met historische bezienswaardigheden en culinaire ontdekkingen.
            </p>
            
            {/* Social Share for regions page */}
            <div className="mt-8 flex justify-center">
              <SocialShare 
                url="/regios" 
                title="Alle Regio's - RouteParel" 
                description="Ontdek alle beschikbare regio's voor uw auto avontuur"
                variant="compact"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Advertisement */}
      <ContentAd />

      {/* Regions Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-3/4">
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
                  <div className="w-12 h-8 mr-4 border border-gray-300 rounded-sm overflow-hidden">
                    <svg viewBox="0 0 9 6" className="w-full h-full">
                      <rect width="9" height="2" fill="#AE1C28"/>
                      <rect width="9" height="2" y="2" fill="#FFFFFF"/>
                      <rect width="9" height="2" y="4" fill="#21468B"/>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Nederland</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regions.filter(region => !region.name.includes("Belgische") && !region.name.includes("Zwarte") && !region.name.includes("Eifel") && !region.name.includes("Luxemburg")).map((region, index) => (
                    <div key={region.id} className={`animate-discovery-reveal animate-discovery-delay-${Math.min(index + 1, 4)}`}>
                      <RegionCard region={region} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Belgische Regio's */}
              <div className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-8 mr-4 border border-gray-300 rounded-sm overflow-hidden">
                    <svg viewBox="0 0 15 13" className="w-full h-full">
                      <rect width="5" height="13" fill="#000000"/>
                      <rect width="5" height="13" x="5" fill="#FFD700"/>
                      <rect width="5" height="13" x="10" fill="#FF0000"/>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">België</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regions.filter(region => region.name.includes("Belgische")).map((region, index) => (
                    <div key={region.id} className={`animate-discovery-reveal animate-discovery-delay-${Math.min(index + 1, 4)}`}>
                      <RegionCard region={region} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Duitse & Luxemburgse Regio's */}
              {regions.filter(region => region.name.includes("Zwarte") || region.name.includes("Eifel") || region.name.includes("Luxemburg")).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-8 mr-4 border border-gray-300 rounded-sm overflow-hidden">
                      <svg viewBox="0 0 15 10" className="w-full h-full">
                        <rect width="15" height="3.33" fill="#000000"/>
                        <rect width="15" height="3.33" y="3.33" fill="#DD0000"/>
                        <rect width="15" height="3.33" y="6.66" fill="#FFCE00"/>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Duitsland & Luxemburg</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regions.filter(region => region.name.includes("Zwarte") || region.name.includes("Eifel") || region.name.includes("Luxemburg")).map((region, index) => (
                      <div key={region.id} className={`animate-discovery-reveal animate-discovery-delay-${Math.min(index + 1, 4)}`}>
                        <RegionCard region={region} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Geen regio's gevonden.</p>
            </div>
          )}
            </div>
            
            {/* Sidebar with advertisements */}
            <div className="lg:w-1/4">
              <SidebarAd />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}