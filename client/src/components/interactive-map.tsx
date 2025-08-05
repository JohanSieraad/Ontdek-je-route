import { MapPin, Route, Bike, Plus, Minus, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveMap() {
  const handleZoomIn = () => {
    // TODO: Implement zoom in functionality
    console.log("Zoom in");
  };

  const handleZoomOut = () => {
    // TODO: Implement zoom out functionality
    console.log("Zoom out");
  };

  const handleCenterMap = () => {
    // TODO: Implement center map functionality
    console.log("Center map");
  };

  return (
    <section className="py-16 bg-white" id="map">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Interactieve Kaart</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bekijk alle beschikbare routes op onze interactieve kaart van Nederland.
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl p-8 min-h-96 relative border-2 border-dashed border-gray-300">
          {/* Map placeholder content */}
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">Interactieve Kaart</h4>
            <p className="text-gray-500 mb-6">
              Hier wordt de interactieve kaart geïntegreerd met route-overlays en locatie markers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <MapPin className="inline mr-2 h-4 w-4 text-dutch-orange" />
                <span className="text-sm font-medium">Historische Locaties</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <Route className="inline mr-2 h-4 w-4 text-royal-blue" />
                <span className="text-sm font-medium">Wandelroutes</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <Bike className="inline mr-2 h-4 w-4 text-forest-green" />
                <span className="text-sm font-medium">Fietsroutes</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white shadow-md hover:shadow-lg"
              onClick={handleZoomIn}
              data-testid="button-zoom-in"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white shadow-md hover:shadow-lg"
              onClick={handleZoomOut}
              data-testid="button-zoom-out"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white shadow-md hover:shadow-lg"
              onClick={handleCenterMap}
              data-testid="button-center-map"
            >
              <Crosshair className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md max-w-xs">
            <h5 className="font-semibold text-gray-900 mb-2">Legenda</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-dutch-orange rounded-full mr-2"></div>
                <span>Kastelen & Paleizen</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-royal-blue rounded-full mr-2"></div>
                <span>Musea & Monumenten</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-forest-green rounded-full mr-2"></div>
                <span>Natuurgebieden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
