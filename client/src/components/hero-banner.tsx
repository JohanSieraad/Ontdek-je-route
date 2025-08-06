import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Navigation } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        alt="Nederlandse Route Landschap"
        className="w-full h-full object-cover"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nederlandse Routes
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl leading-relaxed">
            Autoroutes langs kastelen, pittoreske dorpjes en toprestaurants. 
            Ontdek de mooiste routes met culinaire stops en Instagram-waardige foto plekken.
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 text-lg mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>8 regio's beschikbaar</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              <span>5-8 uur rijden</span>
            </div>
          </div>

          <Link href="/meerdaagse-routes">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 text-lg shadow-lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Start je Route Avontuur
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}