import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Route, Users } from "lucide-react";
import { Region } from "@shared/schema";

interface AddRouteSectionProps {
  region: Region;
}

export function AddRouteSection({ region }: AddRouteSectionProps) {
  const [showOptions, setShowOptions] = useState(false);

  const routeCreationOptions = [
    {
      id: "stops",
      title: "Route met Stops",
      description: "Maak een route door interessante stops te selecteren",
      icon: <MapPin className="h-6 w-6" />,
      method: "Select waypoints and create a custom route through historical sites",
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      id: "gps-tracking",
      title: "GPS Tracking Route",
      description: "Rijd, fiets of wandel de route en laat GPS de weg vastleggen",
      icon: <Route className="h-6 w-6" />,
      method: "Record your actual journey using GPS tracking",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      id: "community",
      title: "Community Route",
      description: "Deel een bestaande route die je kent met andere gebruikers",
      icon: <Users className="h-6 w-6" />,
      method: "Upload existing GPX/KML files or share local knowledge",
      color: "bg-purple-50 border-purple-200 text-purple-700"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Voeg Uw Eigen Route Toe</h3>
          <p className="text-gray-600">Help andere reizigers door uw favoriete routes in {region.name} te delen</p>
        </div>
        <Button 
          onClick={() => setShowOptions(!showOptions)}
          className="bg-dutch-orange hover:bg-dutch-orange/90"
          data-testid="button-add-route"
        >
          <Plus className="mr-2 h-4 w-4" />
          Route Toevoegen
        </Button>
      </div>

      {showOptions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {routeCreationOptions.map((option) => (
            <Card 
              key={option.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${option.color} border-2`}
              data-testid={`card-route-option-${option.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {option.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-3">
                  {option.description}
                </CardDescription>
                <Badge variant="secondary" className="text-xs">
                  {option.method}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showOptions && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Benodigde Informatie</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Route naam en beschrijving</li>
            <li>• Start- en eindpunt</li>
            <li>• Geschatte duur en afstand</li>
            <li>• Moeilijkheidsgraad (gemakkelijk/gemiddeld/zwaar)</li>
            <li>• Foto's van interessante stops (optioneel)</li>
            <li>• Audio verhaal of uitleg (optioneel)</li>
          </ul>
          <Button 
            className="mt-4 w-full bg-dutch-orange hover:bg-dutch-orange/90"
            data-testid="button-start-route-creation"
          >
            Start Route Maken
          </Button>
        </div>
      )}
    </div>
  );
}