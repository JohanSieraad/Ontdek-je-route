import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Navigation } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative h-[700px] overflow-hidden">
      {/* Kasteel Zuylen Background Image */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Slot_Zuylen_vanuit_de_lucht.jpg/1200px-Slot_Zuylen_vanuit_de_lucht.jpg"
        alt="Kasteel Zuylen - RouteParel"
        className="w-full h-full object-cover"
      />
      {/* Elegant Gradient Overlay - kasteel route style */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
      
      {/* Crown Badge - zoals op kasteel popup */}
      <div className="absolute top-6 left-6">
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          👑 <span>Kasteel Routes</span>
        </div>
      </div>
      
      {/* Main Content - kasteel route style overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-discovery-reveal">
            RouteParel
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
            Ontdek historische kastelen, pittoreske dorpjes en authentieke restaurants. 
            Van Kasteel Zuylen tot Muiderslot - jouw perfecte autoroute avontuur begint hier.
          </p>
          
          {/* Stats Row - kasteel route detail style */}
          <div className="flex flex-wrap items-center text-white text-lg space-x-6 mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span>11 regio's beschikbaar</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-yellow-400" />
              <span>3-8 uur rijden</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-yellow-400" />
              <span>GPS navigatie</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="#routes">
              <Button
                size="lg"
                className="bg-gradient-to-r from-dutch-orange to-sunset-pink text-white hover:from-dutch-orange/90 hover:to-sunset-pink/90 font-semibold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚗 Start je Kasteel Route
              </Button>
            </Link>
            <Link href="/regios">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg shadow-xl backdrop-blur-sm"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Bekijk Alle Regio's
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}