import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AudioPlayer } from "./audio-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, RouteStop, AudioTrack } from "@shared/schema";
import { Clock, MapPin, Star, Play, Download, Share } from "lucide-react";

interface RouteModalProps {
  route: Route | null;
  stops: RouteStop[];
  audioTracks: AudioTrack[];
  isOpen: boolean;
  onClose: () => void;
}

export function RouteModal({ route, stops, audioTracks, isOpen, onClose }: RouteModalProps) {
  if (!route) return null;

  const mainAudioTrack = audioTracks.find(track => !track.stopId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        {/* Route Header */}
        <div className="relative">
          <img 
            src={route.imageUrl} 
            alt={route.title} 
            className="w-full h-64 object-cover rounded-lg"
            data-testid="img-modal-route"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2" data-testid="text-modal-title">
                {route.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center text-white text-sm space-x-4">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400" />
                <span>{route.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Route Details */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{route.category}</Badge>
              <Badge variant="outline">{route.difficulty}</Badge>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Beschrijving</h4>
            <p className="text-gray-600">{route.description}</p>
          </div>

          {/* Audio Player Section */}
          {mainAudioTrack && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Audio Gids</h4>
              <AudioPlayer track={mainAudioTrack} />
            </div>
          )}

          {/* Route Stops */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Route Stops</h4>
            <div className="space-y-4">
              {stops.map((stop) => (
                <div key={stop.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-dutch-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    <span>{stop.number}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">{stop.title}</h5>
                    <p className="text-gray-600 text-sm mb-2">{stop.description}</p>
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-dutch-orange hover:bg-dutch-orange/90" data-testid="button-modal-start">
              <Play className="mr-2 h-4 w-4" />
              Route Starten
            </Button>
            <Button variant="outline" className="flex-1 border-dutch-orange text-dutch-orange hover:bg-dutch-orange hover:text-white" data-testid="button-modal-download">
              <Download className="mr-2 h-4 w-4" />
              Route Downloaden
            </Button>
            <Button variant="outline" className="sm:w-auto" data-testid="button-modal-share">
              <Share className="mr-2 h-4 w-4" />
              Delen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
