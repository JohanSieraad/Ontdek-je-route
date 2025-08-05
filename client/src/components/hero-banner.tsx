import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Route, Clock } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-orange-800/70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg animate-discovery-reveal">
            Ontdek de Mooiste Autoroutes
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md animate-discovery-reveal animate-discovery-delay-1">
            Rijd langs kastelen, pittoreske dorpjes en toprestaurants in Nederland en België. 
            Compleet met parkeerplekken, fotostops en culinaire ervaringen.
          </p>
          
          {/* Country Selection with Flags */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a href="#dutch-regions">
              <Button 
                size="lg" 
                className="bg-white/95 hover:bg-white text-gray-900 border-2 border-white/30 hover:border-dutch-orange transition-all duration-300 min-w-[200px] h-16 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 interactive-hover animate-discovery-reveal animate-discovery-delay-2"
                data-testid="button-nederland"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                    <svg viewBox="0 0 9 6" className="w-full h-full">
                      <rect width="9" height="2" fill="#AE1C28"/>
                      <rect width="9" height="2" y="2" fill="#FFFFFF"/>
                      <rect width="9" height="2" y="4" fill="#21468B"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Nederland</div>
                    <div className="text-sm text-gray-500">6 regio's</div>
                  </div>
                </div>
              </Button>
            </a>
            
            <a href="#belgian-regions">
              <Button 
                size="lg" 
                className="bg-white/95 hover:bg-white text-gray-900 border-2 border-white/30 hover:border-dutch-orange transition-all duration-300 min-w-[200px] h-16 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 interactive-hover animate-discovery-reveal animate-discovery-delay-3"
                data-testid="button-belgie"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                    <svg viewBox="0 0 15 10" className="w-full h-full">
                      <rect width="5" height="10" fill="#000000"/>
                      <rect x="5" width="5" height="10" fill="#FFD700"/>
                      <rect x="10" width="5" height="10" fill="#FF0000"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">België</div>
                    <div className="text-sm text-gray-500">Ardennen</div>
                  </div>
                </div>
              </Button>
            </a>
          </div>
        </div>

        {/* Floating Discovery Stats */}
        <div className="flex justify-center space-x-4 animate-float mb-8">
          <div className="bg-gradient-to-r from-dutch-orange to-sunset-pink text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse-glow">
            🚗 22 autoroutes beschikbaar
          </div>
          <div className="bg-gradient-to-r from-royal-blue to-sky-blue text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse-glow">
            📍 1.200+ km routes
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-discovery-reveal animate-discovery-delay-1">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">GPS Navigatie</h3>
            <p className="text-white/80 text-sm">Google Maps & Waze integratie voor optimale routes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4">
              <Route className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Audio Gidsen</h3>
            <p className="text-white/80 text-sm">Luister naar verhalen en geschiedenis onderweg</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Flexibele Routes</h3>
            <p className="text-white/80 text-sm">Van 2 uur wandelen tot dagtochten fietsen</p>
          </div>
        </div>
      </div>
    </div>
  );
}