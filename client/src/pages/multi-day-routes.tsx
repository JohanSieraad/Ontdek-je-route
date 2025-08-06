import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, MapPin, Users, Star, Clock, Euro, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { MultiDayRoute } from "@shared/schema";

export default function MultiDayRoutes() {
  const { data: multiDayRoutes, isLoading } = useQuery<MultiDayRoute[]>({
    queryKey: ["/api/multi-day-routes"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meerdaagse Route Ervaringen
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ontdek Nederland en België in 3-7 dagen met authentieke accommodaties, 
            culinaire hoogtepunten en onvergetelijke ervaringen. Alle overnachtingen 
            inclusief via onze hotel partners.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              3-7 Dagen Routes
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              Nederland & België
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              Authentieke Accommodaties
            </Badge>
          </div>
        </div>

        {/* Multi-day Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {multiDayRoutes?.map((route) => (
            <Card key={route.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={route.imageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3"}
                  alt={route.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  data-testid={`img-multiday-route-${route.id}`}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {route.isPopular === 1 && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Populair
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {route.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-500 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {route.duration}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors" data-testid={`text-route-title-${route.id}`}>
                  {route.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {route.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Route Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span data-testid={`text-distance-${route.id}`}>{route.totalDistance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span data-testid={`text-rating-${route.id}`}>{route.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>{route.difficulty}</span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Totaalprijs per persoon</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`text-price-${route.id}`}>
                        {route.priceRange}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Inclusief accommodaties</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Affiliate commissie: {route.affiliateCommission}%</p>
                    </div>
                  </div>
                </div>

                {/* Quick Features */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Kasteel hotels</Badge>
                  <Badge variant="outline" className="text-xs">Michelin restaurants</Badge>
                  <Badge variant="outline" className="text-xs">Instagram spots</Badge>
                  <Badge variant="outline" className="text-xs">Gratis annulering</Badge>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/multi-day-routes/${route.id}`} className="w-full">
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white group"
                    data-testid={`button-view-multiday-${route.id}`}
                  >
                    Bekijk Route Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Klaar voor je Volgende Avontuur?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Boek direct je accommodaties via onze partners Airbnb en Booking.com. 
            Authentieke Nederlandse kasteel hotels, boerderij B&B's en boutique accommodaties wachten op je.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/accommodations">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <MapPin className="w-5 h-5 mr-2" />
                Bekijk Accommodaties
              </Button>
            </Link>
            <Link href="/regions">
              <Button size="lg" variant="outline">
                <Calendar className="w-5 h-5 mr-2" />
                Dagelijse Routes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}