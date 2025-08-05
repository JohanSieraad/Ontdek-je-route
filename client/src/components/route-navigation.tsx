import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Clock, Route as RouteIcon, Car, Bike, PersonStanding } from "lucide-react";
import { Route, RouteStop } from "@shared/schema";

interface RouteNavigationProps {
  route: Route;
  stops: RouteStop[];
}

interface NavigationPreferences {
  avoidHighways: boolean;
  avoidTolls: boolean;
  avoidFerries: boolean;
  preferScenic: boolean;
  transportMode: 'driving' | 'walking' | 'bicycling' | 'transit';
  provider: 'google' | 'waze' | 'openstreetmap';
}

export function RouteNavigation({ route, stops }: RouteNavigationProps) {
  const [preferences, setPreferences] = useState<NavigationPreferences>({
    avoidHighways: true, // Default to scenic routes
    avoidTolls: true,
    avoidFerries: false,
    preferScenic: true,
    transportMode: 'driving',
    provider: 'google'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleStartNavigation = async () => {
    setIsLoading(true);
    
    try {
      // Future implementation: Get route coordinates from stops
      const waypoints = stops
        .filter(stop => stop.coordinates)
        .map(stop => stop.coordinates as { lat: number; lng: number });

      // In the future, this would call the navigation service
      const navigationData = {
        waypoints,
        preferences,
        route: route.id
      };

      console.log('Starting navigation with:', navigationData);

      // For now, open external navigation apps
      if (preferences.provider === 'google' && waypoints.length > 0) {
        const firstStop = waypoints[0];
        const lastStop = waypoints[waypoints.length - 1];
        const waypointParams = waypoints.slice(1, -1)
          .map(point => `${point.lat},${point.lng}`)
          .join('|');
        
        const googleMapsUrl = `https://www.google.com/maps/dir/${firstStop.lat},${firstStop.lng}/${waypointParams ? waypointParams + '/' : ''}${lastStop.lat},${lastStop.lng}`;
        window.open(googleMapsUrl, '_blank');
      } else if (preferences.provider === 'waze' && waypoints.length > 0) {
        const destination = waypoints[waypoints.length - 1];
        const wazeUrl = `https://waze.com/ul?ll=${destination.lat}%2C${destination.lng}&navigate=yes`;
        window.open(wazeUrl, '_blank');
      }

    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'driving': return <Car className="h-4 w-4" />;
      case 'bicycling': return <Bike className="h-4 w-4" />;
      case 'walking': return <PersonStanding className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-dutch-orange" />
          Navigatie Instellingen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transport Mode */}
        <div className="space-y-2">
          <Label htmlFor="transport-mode">Vervoermiddel</Label>
          <Select
            value={preferences.transportMode}
            onValueChange={(value: any) => 
              setPreferences(prev => ({ ...prev, transportMode: value }))
            }
          >
            <SelectTrigger data-testid="select-transport-mode">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {getTransportIcon(preferences.transportMode)}
                  <span className="capitalize">{preferences.transportMode === 'driving' ? 'Auto' : 
                    preferences.transportMode === 'bicycling' ? 'Fiets' : 'Wandelen'}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="driving">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Auto
                </div>
              </SelectItem>
              <SelectItem value="bicycling">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  Fiets
                </div>
              </SelectItem>
              <SelectItem value="walking">
                <div className="flex items-center gap-2">
                  <PersonStanding className="h-4 w-4" />
                  Wandelen
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Provider */}
        <div className="space-y-2">
          <Label htmlFor="provider">Navigatie App</Label>
          <Select
            value={preferences.provider}
            onValueChange={(value: any) => 
              setPreferences(prev => ({ ...prev, provider: value }))
            }
          >
            <SelectTrigger data-testid="select-provider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Maps</SelectItem>
              <SelectItem value="waze">Waze</SelectItem>
              <SelectItem value="openstreetmap">OpenStreetMap</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Route Preferences */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Route Voorkeuren</Label>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="avoid-highways" className="text-sm">
              Snelwegen mijden
            </Label>
            <Switch
              id="avoid-highways"
              checked={preferences.avoidHighways}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, avoidHighways: checked }))
              }
              data-testid="switch-avoid-highways"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="avoid-tolls" className="text-sm">
              Tolwegen mijden
            </Label>
            <Switch
              id="avoid-tolls"
              checked={preferences.avoidTolls}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, avoidTolls: checked }))
              }
              data-testid="switch-avoid-tolls"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="avoid-ferries" className="text-sm">
              Veerboten mijden
            </Label>
            <Switch
              id="avoid-ferries"
              checked={preferences.avoidFerries}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, avoidFerries: checked }))
              }
              data-testid="switch-avoid-ferries"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="prefer-scenic" className="text-sm">
              Voorkeur voor mooie routes
            </Label>
            <Switch
              id="prefer-scenic"
              checked={preferences.preferScenic}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, preferScenic: checked }))
              }
              data-testid="switch-prefer-scenic"
            />
          </div>
        </div>

        {/* Route Preview */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Route Overzicht</Label>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stops:</span>
              <Badge variant="secondary">{stops.length} locaties</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Geschatte duur:</span>
              <span className="text-sm font-medium">{route.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Afstand:</span>
              <span className="text-sm font-medium">{route.distance}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleStartNavigation}
          disabled={isLoading || stops.length === 0}
          className="w-full bg-dutch-orange hover:bg-dutch-orange/90"
          data-testid="button-start-navigation"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Route voorbereiden...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4" />
              Navigatie Starten
            </div>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          * Dit opent de navigatie in je gekozen app met de route stops
        </p>
      </CardContent>
    </Card>
  );
}