import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { AudioPlayer } from "@/components/audio-player";
import { Footer } from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Route, RouteStop, AudioTrack } from "@shared/schema";
import { ArrowLeft, Clock, MapPin, Star, Play, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RouteDetailPage() {
  const { routeId } = useParams();

  const { data: route, isLoading: routeLoading } = useQuery<Route>({
    queryKey: ["/api/routes", routeId],
  });

  const { data: stops, isLoading: stopsLoading } = useQuery<RouteStop[]>({
    queryKey: ["/api/routes", routeId, "stops"],
    enabled: !!routeId,
  });

  const { data: audioTracks, isLoading: audioLoading } = useQuery<AudioTrack[]>({
    queryKey: ["/api/routes", routeId, "audio"],
    enabled: !!routeId,
  });

  if (routeLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300"></div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Route niet gevonden</h1>
            <Link href="/">
              <Button data-testid="button-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mainAudioTrack = audioTracks?.find(track => !track.stopId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Route Header */}
      <div className="relative">
        <img 
          src={route.imageUrl} 
          alt={route.title} 
          className="w-full h-64 object-cover"
          data-testid="img-route-header"
        />
        <Button 
          variant="outline" 
          className="absolute top-4 left-4 bg-white/80 hover:bg-white"
          data-testid="button-back"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug
          </Link>
        </Button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" data-testid="text-route-title">
            {route.title}
          </h1>
          <div className="flex items-center text-white text-sm space-x-4">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span data-testid="text-route-duration">{route.duration}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              <span data-testid="text-route-distance">{route.distance}</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 text-yellow-400" />
              <span data-testid="text-route-rating">{route.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Route Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" data-testid="badge-category">{route.category}</Badge>
            <Badge variant="outline" data-testid="badge-difficulty">{route.difficulty}</Badge>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Beschrijving</h2>
          <p className="text-gray-600 mb-6" data-testid="text-route-description">
            {route.description}
          </p>

          {/* Audio Player Section */}
          {mainAudioTrack && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Audio Gids</h3>
              <AudioPlayer track={mainAudioTrack} />
            </div>
          )}

          {/* Route Stops */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Stops</h3>
            {stopsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stops && stops.length > 0 ? (
              <div className="space-y-4">
                {stops.map((stop) => (
                  <div 
                    key={stop.id} 
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    data-testid={`stop-${stop.number}`}
                  >
                    <div className="bg-dutch-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      <span>{stop.number}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1" data-testid={`text-stop-title-${stop.number}`}>
                        {stop.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2" data-testid={`text-stop-description-${stop.number}`}>
                        {stop.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{stop.duration}</span>
                        {stop.hasAudio === 1 && (
                          <>
                            <div className="mx-2">•</div>
                            <span>Audio beschikbaar</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Geen stops gevonden voor deze route.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-dutch-orange hover:bg-dutch-orange/90" data-testid="button-start-route">
              <Play className="mr-2 h-4 w-4" />
              Route Starten
            </Button>
            <Button variant="outline" className="flex-1 border-dutch-orange text-dutch-orange hover:bg-dutch-orange hover:text-white" data-testid="button-download-route">
              <Download className="mr-2 h-4 w-4" />
              Route Downloaden
            </Button>
            <Button variant="outline" className="sm:w-auto" data-testid="button-share-route">
              <Share className="mr-2 h-4 w-4" />
              Delen
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
