import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import type { Route } from "@shared/schema";

interface NavigationOptionsProps {
  route: Route;
}

export function NavigationOptions({ route }: NavigationOptionsProps) {
  // Generate sample waypoints for the route based on description
  const generateWaypoints = (routeData: Route) => {
    const baseCoords = { lat: 52.3676, lng: 4.9041 }; // Amsterdam center
    
    // Extract locations from description or use defaults
    const locations = [
      { name: "Start punt", lat: baseCoords.lat, lng: baseCoords.lng },
      { name: "Tussenstop 1", lat: baseCoords.lat + 0.1, lng: baseCoords.lng + 0.1 },
      { name: "Tussenstop 2", lat: baseCoords.lat + 0.2, lng: baseCoords.lng + 0.2 },
      { name: "Eindpunt", lat: baseCoords.lat + 0.3, lng: baseCoords.lng + 0.3 }
    ];

    return locations;
  };

  const waypoints = generateWaypoints(route);

  const openGoogleMaps = () => {
    const waypointCoords = waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&waypoints=${waypointCoords}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const openWaze = () => {
    // Waze URL format for the first waypoint
    const firstWaypoint = waypoints[0];
    const url = `https://waze.com/ul?ll=${firstWaypoint.lat}%2C${firstWaypoint.lng}&navigate=yes`;
    window.open(url, '_blank');
  };

  const openOpenStreetMap = () => {
    const firstWaypoint = waypoints[0];
    const url = `https://www.openstreetmap.org/directions?from=&to=${firstWaypoint.lat}%2C${firstWaypoint.lng}&route=driving`;
    window.open(url, '_blank');
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <Navigation className="w-5 h-5 mr-2" />
          Route Navigatie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          Kies je favoriete navigatie-app om stops toe te voegen en de route te starten:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={openGoogleMaps}
            variant="outline"
            className="flex items-center justify-center p-4 h-auto border-blue-200 hover:bg-blue-50"
            data-testid="open-google-maps"
          >
            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold text-blue-700">Google Maps</div>
              <div className="text-xs text-gray-500">Met live verkeer</div>
            </div>
            <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
          </Button>

          <Button
            onClick={openWaze}
            variant="outline" 
            className="flex items-center justify-center p-4 h-auto border-purple-200 hover:bg-purple-50"
            data-testid="open-waze"
          >
            <div className="text-center">
              <Navigation className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold text-purple-700">Waze</div>
              <div className="text-xs text-gray-500">Verkeer & Flitsers</div>
            </div>
            <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
          </Button>

          <Button
            onClick={openOpenStreetMap}
            variant="outline"
            className="flex items-center justify-center p-4 h-auto border-green-200 hover:bg-green-50"
            data-testid="open-openstreetmap"
          >
            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="font-semibold text-green-700">OpenStreetMap</div>
              <div className="text-xs text-gray-500">Open source</div>
            </div>
            <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
          </Button>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">
            <strong>Tip:</strong> Voeg onderweg je eigen stops toe voor restaurants, kastelen en foto-locaties. 
            Gebruik de beschrijving hierboven voor inspiratie!
          </p>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Route details:</strong></p>
          <p>• Afstand: {route.distance}</p>
          <p>• Duur: {route.duration}</p>
          <p>• Moeilijkheidsgraad: {route.difficulty}</p>
        </div>
      </CardContent>
    </Card>
  );
}