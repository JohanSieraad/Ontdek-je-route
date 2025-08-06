import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Calendar, MapPin, Users, Star, Clock, Euro, ArrowRight, Car, Utensils, Camera, Bed, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { MultiDayRoute, ItineraryDay, Accommodation } from "@shared/schema";

export default function MultiDayRouteDetail() {
  const { id } = useParams();

  const { data: route, isLoading: routeLoading } = useQuery<MultiDayRoute>({
    queryKey: [`/api/multi-day-routes/${id}`],
    enabled: !!id,
  });

  const { data: itinerary, isLoading: itineraryLoading } = useQuery<ItineraryDay[]>({
    queryKey: [`/api/multi-day-routes/${id}/itinerary`],
    enabled: !!id,
  });

  const { data: accommodations } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations"],
  });

  if (routeLoading || itineraryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-pulse">
        <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Route niet gevonden</h1>
          <Link href="/multi-day-routes">
            <Button>Terug naar routes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getAccommodationById = (accommodationId?: string | null) => {
    if (!accommodationId || !accommodations) return null;
    return accommodations.find(acc => acc.id === accommodationId);
  };

  const handleBookingClick = (accommodation: Accommodation, platform: 'airbnb' | 'booking') => {
    const url = platform === 'airbnb' ? accommodation.airbnbUrl : accommodation.bookingComUrl;
    if (url) {
      // Track booking attempt
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accommodationId: accommodation.id,
          multiDayRouteId: route.id,
          platform,
          bookingStatus: 'initiated'
        })
      }).catch(console.error);

      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={route.imageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3"}
          alt={route.title}
          className="w-full h-full object-cover"
          data-testid={`img-route-hero-${route.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-orange-500">{route.category}</Badge>
            <Badge className="bg-blue-600">{route.duration}</Badge>
            {route.isPopular === 1 && (
              <Badge className="bg-pink-500">
                <Star className="w-3 h-3 mr-1" />
                Populair
              </Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid={`text-route-title-${route.id}`}>
            {route.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span data-testid={`text-distance-${route.id}`}>{route.totalDistance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span data-testid={`text-rating-${route.id}`}>{route.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{route.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overzicht</TabsTrigger>
                <TabsTrigger value="itinerary">Dag-voor-Dag</TabsTrigger>
                <TabsTrigger value="accommodations">Accommodaties</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Route Beschrijving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {route.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900 dark:text-white">{route.duration.split('/')[0]}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Dagen</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Car className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900 dark:text-white">{route.totalDistance}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Afstand</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900 dark:text-white">{route.rating}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Beoordeling</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900 dark:text-white">{route.difficulty}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Niveau</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                {itinerary?.map((day) => {
                  const accommodation = getAccommodationById(day.accommodationId);
                  
                  return (
                    <Card key={day.id} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">
                            Dag {day.dayNumber}: {day.title}
                          </CardTitle>
                          <Badge variant="secondary">{day.estimatedDrivingTime}</Badge>
                        </div>
                        <CardDescription className="text-gray-700 dark:text-gray-200">
                          {day.startLocation} → {day.endLocation} ({day.drivingDistance})
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {day.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Highlights */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Star className="w-4 h-4 mr-2 text-yellow-500" />
                              Hoogtepunten
                            </h4>
                            <ul className="space-y-2">
                              {day.highlights?.map((highlight, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                  <ChevronRight className="w-3 h-3 mt-1 mr-1 text-orange-500 flex-shrink-0" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Restaurants */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Utensils className="w-4 h-4 mr-2 text-blue-500" />
                              Restaurants
                            </h4>
                            <ul className="space-y-2">
                              {day.restaurants?.map((restaurant, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                  <ChevronRight className="w-3 h-3 mt-1 mr-1 text-blue-500 flex-shrink-0" />
                                  {restaurant}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instagram Spots */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Camera className="w-4 h-4 mr-2 text-pink-500" />
                              Foto Spots
                            </h4>
                            <ul className="space-y-2">
                              {day.instagramSpots?.map((spot, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                  <ChevronRight className="w-3 h-3 mt-1 mr-1 text-pink-500 flex-shrink-0" />
                                  {spot}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Accommodation for this day */}
                        {accommodation && (
                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Bed className="w-4 h-4 mr-2 text-green-500" />
                              Overnachting: {accommodation.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {accommodation.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {accommodation.amenities?.slice(0, 4).map((amenity, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                size="sm" 
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleBookingClick(accommodation, 'airbnb')}
                                data-testid={`button-book-airbnb-${accommodation.id}`}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Airbnb
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleBookingClick(accommodation, 'booking')}
                                data-testid={`button-book-booking-${accommodation.id}`}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Booking.com
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="accommodations" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {accommodations?.filter(acc => 
                    itinerary?.some(day => day.accommodationId === acc.id)
                  ).map((accommodation) => (
                    <Card key={accommodation.id} className="overflow-hidden">
                      <div className="md:flex">
                        <img
                          src={accommodation.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"}
                          alt={accommodation.name}
                          className="w-full md:w-80 h-48 md:h-auto object-cover"
                          data-testid={`img-accommodation-${accommodation.id}`}
                        />
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white" data-testid={`text-accommodation-name-${accommodation.id}`}>
                                {accommodation.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">{accommodation.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`text-accommodation-price-${accommodation.id}`}>
                                {accommodation.pricePerNight}
                              </p>
                              <div className="flex items-center mt-1">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{accommodation.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {accommodation.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              {accommodation.type}
                            </Badge>
                            {accommodation.specialFeatures?.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-3">
                            <Button 
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleBookingClick(accommodation, 'airbnb')}
                              data-testid={`button-book-airbnb-detail-${accommodation.id}`}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Boek via Airbnb
                            </Button>
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleBookingClick(accommodation, 'booking')}
                              data-testid={`button-book-booking-detail-${accommodation.id}`}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Boek via Booking.com
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Booking Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Route Boeken</span>
                  <Badge className="bg-green-500 text-white">
                    <Euro className="w-3 h-3 mr-1" />
                    {route.affiliateCommission}% korting
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white" data-testid={`text-total-price-${route.id}`}>
                    {route.priceRange}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">per persoon, alle accommodaties inclusief</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Route dagen:</span>
                    <span className="font-medium">{route.duration.split('/')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Overnachtingen:</span>
                    <span className="font-medium">{route.duration.split('/')[1] || 'Geen'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Afstand totaal:</span>
                    <span className="font-medium">{route.totalDistance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Moeilijkheidsgraad:</span>
                    <span className="font-medium">{route.difficulty}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Plan je Route
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MapPin className="w-4 h-4 mr-2" />
                    Download Route GPS
                  </Button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Gratis annulering tot 24 uur voor vertrek
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Route Statistieken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Beoordeling:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{route.rating}/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Categorie:</span>
                  <Badge variant="secondary">{route.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Verwachte commissie:</span>
                  <span className="font-medium text-green-600">{route.affiliateCommission}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}