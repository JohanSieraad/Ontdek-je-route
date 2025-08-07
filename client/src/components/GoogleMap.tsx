import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useQuery } from '@tanstack/react-query';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  route?: Array<{ lat: number; lng: number }>;
  className?: string;
}

export default function GoogleMap({ 
  center = { lat: 52.3676, lng: 4.9041 }, // Amsterdam default
  zoom = 10,
  markers = [],
  route = [],
  className = "w-full h-96"
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch API key from backend
  const { data: config } = useQuery({
    queryKey: ['/api/config'],
    queryFn: async () => {
      const response = await fetch('/api/config');
      return response.json();
    }
  });

  useEffect(() => {
    if (!config?.googleMapsApiKey) return;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: config.googleMapsApiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (!mapRef.current) return;

        const googleMap = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        setMap(googleMap);

        // Add markers
        const infoWindow = new google.maps.InfoWindow();
        
        markers.forEach((marker) => {
          const mapMarker = new google.maps.Marker({
            position: marker.position,
            map: googleMap,
            title: marker.title,
          });

          if (marker.info) {
            mapMarker.addListener('click', () => {
              infoWindow.setContent(`
                <div class="p-2">
                  <h3 class="font-semibold text-lg">${marker.title}</h3>
                  <p class="text-sm text-gray-600">${marker.info}</p>
                </div>
              `);
              infoWindow.open(googleMap, mapMarker);
            });
          }
        });

        // Add route if provided
        if (route.length > 1) {
          const routePath = new google.maps.Polyline({
            path: route,
            geodesic: true,
            strokeColor: '#FF6B35',
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });

          routePath.setMap(googleMap);

          // Fit bounds to show entire route
          const bounds = new google.maps.LatLngBounds();
          route.forEach(point => bounds.extend(point));
          googleMap.fitBounds(bounds);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      }
    };

    initMap();
  }, [config?.googleMapsApiKey, center, zoom, markers, route]);

  if (error) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">⚠️ Kaart kon niet geladen worden</p>
          <p className="text-sm text-gray-500">Google Maps API key vereist</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Kaart wordt geladen...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className + " rounded-lg"} />;
}