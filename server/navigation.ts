import { RoutePreferences, Coordinates, NavigationResponse } from "@shared/schema";

export interface NavigationService {
  getRoute(
    origin: Coordinates,
    destination: Coordinates,
    preferences: RoutePreferences
  ): Promise<NavigationResponse>;
  
  getMultiStopRoute(
    waypoints: Coordinates[],
    preferences: RoutePreferences
  ): Promise<NavigationResponse>;
}

// Google Maps integration service
export class GoogleMapsNavigationService implements NavigationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getRoute(
    origin: Coordinates,
    destination: Coordinates,
    preferences: RoutePreferences
  ): Promise<NavigationResponse> {
    // Future implementation with Google Maps Directions API
    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      key: this.apiKey,
      language: 'nl',
      region: 'nl',
      mode: preferences.transportMode,
      avoid: this.buildAvoidString(preferences)
    });

    // This would make the actual API call in production
    const url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
    
    // For now, return a mock response structure
    return {
      provider: 'google',
      routes: [{
        summary: 'Route via provinciale wegen',
        duration: '45 minuten',
        distance: '32.5 km',
        steps: [],
        coordinates: [origin, destination]
      }],
      preferences
    };
  }

  async getMultiStopRoute(
    waypoints: Coordinates[],
    preferences: RoutePreferences
  ): Promise<NavigationResponse> {
    if (waypoints.length < 2) {
      throw new Error('Minimaal 2 punten zijn vereist voor een route');
    }

    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const stops = waypoints.slice(1, -1);

    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      waypoints: stops.map(point => `${point.lat},${point.lng}`).join('|'),
      key: this.apiKey,
      language: 'nl',
      region: 'nl',
      mode: preferences.transportMode,
      avoid: this.buildAvoidString(preferences),
      optimize: 'true' // Optimize waypoint order
    });

    const url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
    
    return {
      provider: 'google',
      routes: [{
        summary: 'Geoptimaliseerde route langs alle stops',
        duration: '2.5 uur',
        distance: '45.8 km',
        steps: [],
        coordinates: waypoints
      }],
      preferences
    };
  }

  private buildAvoidString(preferences: RoutePreferences): string {
    const avoid = [];
    if (preferences.avoidHighways) avoid.push('highways');
    if (preferences.avoidTolls) avoid.push('tolls');
    if (preferences.avoidFerries) avoid.push('ferries');
    return avoid.join('|');
  }
}

// Waze integration service (future implementation)
export class WazeNavigationService implements NavigationService {
  async getRoute(
    origin: Coordinates,
    destination: Coordinates,
    preferences: RoutePreferences
  ): Promise<NavigationResponse> {
    // Future Waze API integration
    // Waze has limited public API, mainly for routing to specific locations
    const wazeUrl = `https://waze.com/ul?ll=${destination.lat}%2C${destination.lng}&navigate=yes`;
    
    return {
      provider: 'waze',
      routes: [{
        summary: 'Waze real-time route',
        duration: 'Dynamisch',
        distance: 'Variabel op basis van verkeer',
        steps: [],
        coordinates: [origin, destination]
      }],
      preferences
    };
  }

  async getMultiStopRoute(
    waypoints: Coordinates[],
    preferences: RoutePreferences
  ): Promise<NavigationResponse> {
    // Waze doesn't support multi-stop routes via API
    // Would need to create multiple individual routes
    throw new Error('Waze ondersteunt geen multi-stop routes via API');
  }
}

// OpenStreetMap integration service (free alternative)
export class OpenStreetMapNavigationService implements NavigationService {
  private baseUrl = 'https://router.project-osrm.org/route/v1';

  async getRoute(
    origin: Coordinates,
    destination: Coordinates,
    preferences: RoutePreferences
  ): Promise<NavigationResponse> {
    const profile = this.getOSRMProfile(preferences.transportMode);
    const url = `${this.baseUrl}/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&steps=true&geometries=geojson`;

    // This would make the actual API call in production
    return {
      provider: 'openstreetmap',
      routes: [{
        summary: 'Open source route',
        duration: '40 minuten',
        distance: '28.3 km',
        steps: [],
        coordinates: [origin, destination]
      }],
      preferences
    };
  }

  async getMultiStopRoute(
    waypoints: Coordinates[],
    preferences: RoutePreferences
  ): Promise<NavigationResponse> {
    const profile = this.getOSRMProfile(preferences.transportMode);
    const coordinates = waypoints.map(point => `${point.lng},${point.lat}`).join(';');
    const url = `${this.baseUrl}/${profile}/${coordinates}?overview=full&steps=true&geometries=geojson`;

    return {
      provider: 'openstreetmap',
      routes: [{
        summary: 'Open source multi-stop route',
        duration: '2 uur',
        distance: '42.1 km',
        steps: [],
        coordinates: waypoints
      }],
      preferences
    };
  }

  private getOSRMProfile(mode: string): string {
    switch (mode) {
      case 'driving': return 'driving';
      case 'walking': return 'foot';
      case 'bicycling': return 'bike';
      default: return 'driving';
    }
  }
}

// Factory function to create navigation service
export function createNavigationService(
  provider: 'google' | 'waze' | 'openstreetmap',
  apiKey?: string
): NavigationService {
  switch (provider) {
    case 'google':
      if (!apiKey) throw new Error('Google Maps API key is vereist');
      return new GoogleMapsNavigationService(apiKey);
    case 'waze':
      return new WazeNavigationService();
    case 'openstreetmap':
      return new OpenStreetMapNavigationService();
    default:
      throw new Error(`Onbekende navigatie provider: ${provider}`);
  }
}