import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  Car, 
  MapPin, 
  Clock, 
  Route as RouteIcon,
  ExternalLink 
} from 'lucide-react';

interface RouteNavigationProps {
  routeStops: Array<{
    id: string;
    name: string;
    description: string;
    coordinates: { lat: number; lng: number };
    category?: string;
  }>;
  routeTitle: string;
}

export default function RouteNavigation({ routeStops, routeTitle }: RouteNavigationProps) {
  const [travelMode, setTravelMode] = useState<string>('driving');
  const [avoidHighways, setAvoidHighways] = useState(false);

  const generateGoogleMapsUrl = () => {
    if (routeStops.length === 0) return '#';

    const origin = routeStops[0];
    const destination = routeStops[routeStops.length - 1];
    const waypoints = routeStops.slice(1, -1);

    let url = `https://www.google.com/maps/dir/`;
    
    // Add origin
    url += `${origin.coordinates.lat},${origin.coordinates.lng}`;
    
    // Add waypoints
    waypoints.forEach(stop => {
      url += `/${stop.coordinates.lat},${stop.coordinates.lng}`;
    });
    
    // Add destination
    url += `/${destination.coordinates.lat},${destination.coordinates.lng}`;

    // Add parameters
    url += `?travelmode=${travelMode}`;
    if (avoidHighways) url += `&avoid=highways`;

    return url;
  };

  const generateWazeUrl = () => {
    if (routeStops.length === 0) return '#';
    
    const destination = routeStops[routeStops.length - 1];
    return `https://www.waze.com/ul?ll=${destination.coordinates.lat}%2C${destination.coordinates.lng}&navigate=yes`;
  };

  const openDirections = (service: 'google' | 'waze') => {
    const url = service === 'google' ? generateGoogleMapsUrl() : generateWazeUrl();
    window.open(url, '_blank');
  };

  const calculateEstimatedTime = () => {
    // Simple estimation: ~1 hour per stop + 30 min driving time
    const estimatedHours = Math.max(2, routeStops.length * 1 + 0.5);
    return `${Math.floor(estimatedHours)}-${Math.ceil(estimatedHours)} uur`;
  };

  const calculateDistance = () => {
    // Simple estimation based on number of stops
    const estimatedKm = routeStops.length * 15 + 20;
    return `~${estimatedKm} km`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Navigatie voor {routeTitle}
        </CardTitle>
        <CardDescription>
          Plan je route en start navigatie naar {routeStops.length} stops
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{calculateEstimatedTime()}</span>
          </div>
          <div className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{calculateDistance()}</span>
          </div>
        </div>

        {/* Travel Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Vervoermiddel</label>
          <Select value={travelMode} onValueChange={setTravelMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="driving">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Auto
                </div>
              </SelectItem>
              <SelectItem value="walking">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-center">🚶</span>
                  Wandelen
                </div>
              </SelectItem>
              <SelectItem value="bicycling">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-center">🚴</span>
                  Fiets
                </div>
              </SelectItem>
              <SelectItem value="transit">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-center">🚌</span>
                  Openbaar Vervoer
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Route Stops */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Route Stops</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {routeStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3 text-sm p-2 bg-muted/30 rounded">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{stop.name}</div>
                  {stop.category && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {stop.category}
                    </Badge>
                  )}
                </div>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button 
            onClick={() => openDirections('google')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Google Maps
          </Button>
          <Button 
            variant="outline"
            onClick={() => openDirections('waze')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Waze
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Navigatie opent in een nieuw venster
        </p>
      </CardContent>
    </Card>
  );
}