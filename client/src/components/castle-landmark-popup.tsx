import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Crown, 
  MapPin, 
  Clock, 
  Euro, 
  Camera, 
  Car,
  Lightbulb,
  Star,
  Calendar,
  Building
} from "lucide-react";

interface CastleLandmark {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  historicalPeriod: string;
  builtYear: number;
  architecturalStyle: string;
  visitDuration: string;
  entryFee: string;
  highlights: string[];
  funFacts: string[];
  parkingInfo: string;
  instagramSpots: string[];
  coordinates: { lat: number; lng: number };
  routeIds: string[];
}

interface CastleLandmarkTriggerProps {
  castle: CastleLandmark;
  children: React.ReactNode;
}

export function CastleLandmarkTrigger({ castle, children }: CastleLandmarkTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-yellow-50/30"
        data-testid={`dialog-castle-${castle.id}`}
      >
        <ScrollArea className="h-full pr-4">
          <DialogHeader className="space-y-4 pb-6">
            <div className="relative">
              <img 
                src={castle.imageUrl} 
                alt={castle.name}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                data-testid={`img-castle-detail-${castle.id}`}
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold shadow-lg">
                  <Crown className="h-4 w-4 mr-1" />
                  Kasteel Landmark
                </Badge>
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Crown className="h-8 w-8 text-yellow-600" />
              {castle.name}
            </DialogTitle>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span data-testid={`text-location-${castle.id}`}>{castle.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span data-testid={`text-period-${castle.id}`}>{castle.historicalPeriod}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span data-testid={`text-built-${castle.id}`}>Gebouwd in {castle.builtYear}</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-lg" data-testid={`text-description-${castle.id}`}>
                {castle.description}
              </p>
            </div>

            {/* Visit Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Bezoektijd</h4>
                </div>
                <p className="text-blue-800" data-testid={`text-duration-${castle.id}`}>{castle.visitDuration}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Entree</h4>
                </div>
                <p className="text-green-800" data-testid={`text-entry-fee-${castle.id}`}>{castle.entryFee}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Stijl</h4>
                </div>
                <p className="text-purple-800" data-testid={`text-style-${castle.id}`}>{castle.architecturalStyle}</p>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Hoogtepunten
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {castle.highlights.map((highlight, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    data-testid={`highlight-${castle.id}-${index}`}
                  >
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange-500" />
                Leuke Weetjes
              </h3>
              <div className="space-y-3">
                {castle.funFacts.map((fact, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200"
                    data-testid={`fun-fact-${castle.id}-${index}`}
                  >
                    <Lightbulb className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-800">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instagram Spots */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-pink-500" />
                Instagram Foto Spots
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {castle.instagramSpots.map((spot, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200"
                    data-testid={`instagram-spot-${castle.id}-${index}`}
                  >
                    <Camera className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span className="text-pink-800">{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parking Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Car className="h-5 w-5 text-gray-600" />
                Parkeren
              </h3>
              <p className="text-gray-700" data-testid={`text-parking-${castle.id}`}>{castle.parkingInfo}</p>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-dutch-orange to-sunset-pink hover:from-sunset-pink hover:to-dutch-orange text-white font-semibold"
                onClick={() => window.open(`https://maps.google.com/search/${castle.coordinates.lat},${castle.coordinates.lng}`, '_blank')}
                data-testid={`button-directions-${castle.id}`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Routebeschrijving
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 border-gray-300 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
                data-testid={`button-close-${castle.id}`}
              >
                Sluiten
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}