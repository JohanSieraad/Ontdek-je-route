import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  MapPin,
  Calendar,
  Star,
  Heart,
  Route,
  Camera,
  Car,
  Zap,
  Fuel,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";

interface UserProfile {
  completedRoutes: any[];
  favoriteLocations: any[];
  bookmarkedRoutes: any[];
  vehiclePreferences: any;
  stats: {
    totalRoutes: number;
    totalDistance: number;
    favoriteCategory: string;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingLocation, setEditingLocation] = useState<string | null>(null);

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: !!isAuthenticated,
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');
      
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return response.json();
    },
  });

  // Vehicle preferences mutation
  const vehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/profile/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vehicle preferences');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Voertuigvoorkeuren bijgewerkt",
        description: "Je voertuigvoorkeuren zijn succesvol opgeslagen.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
    onError: () => {
      toast({
        title: "Fout bij opslaan",
        description: "Er ging iets mis bij het opslaan van je voorkeuren.",
        variant: "destructive",
      });
    },
  });

  // Favorite location mutation
  const addLocationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/profile/favorite-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add favorite location');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Locatie toegevoegd",
        description: "Je favoriete locatie is toegevoegd aan je profiel.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    },
  });

  if (authLoading || profileLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="space-y-4">
          <User className="h-16 w-16 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">Login Vereist</h1>
          <p className="text-gray-600">Je moet ingelogd zijn om je profiel te bekijken.</p>
          <Button onClick={() => window.location.href = '/'}>
            Terug naar Home
          </Button>
        </div>
      </div>
    );
  }

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const vehicleData = {
      vehicleType: formData.get('vehicleType'),
      fuelType: formData.get('fuelType'),
      needsCharging: formData.get('needsCharging') === 'on',
      chargingType: formData.get('chargingType'),
      preferredBrands: formData.get('preferredBrands')?.toString().split(',').map(b => b.trim()) || [],
    };

    vehicleMutation.mutate(vehicleData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.profileImageUrl} alt={user?.displayName} />
            <AvatarFallback className="bg-dutch-orange text-white text-lg">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-profile-name">
              {user?.displayName || `${user?.firstName} ${user?.lastName}` || 'Gebruiker'}
            </h1>
            <p className="text-gray-600" data-testid="text-profile-email">{user?.email}</p>
            
            {profile?.stats && (
              <div className="flex space-x-6 mt-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-dutch-orange" data-testid="stat-total-routes">
                    {profile.stats.totalRoutes}
                  </div>
                  <div className="text-xs text-gray-500">Routes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-dutch-orange" data-testid="stat-total-distance">
                    {profile.stats.totalDistance} km
                  </div>
                  <div className="text-xs text-gray-500">Afgelegd</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-dutch-orange" data-testid="stat-favorite-category">
                    {profile.stats.favoriteCategory || 'Geen'}
                  </div>
                  <div className="text-xs text-gray-500">Favoriet</div>
                </div>
              </div>
            )}
          </div>
          
          <Button variant="outline" data-testid="button-edit-profile">
            <Edit className="h-4 w-4 mr-2" />
            Bewerken
          </Button>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <User className="h-4 w-4 mr-2" />
            Overzicht
          </TabsTrigger>
          <TabsTrigger value="routes" data-testid="tab-routes">
            <Route className="h-4 w-4 mr-2" />
            Mijn Routes
          </TabsTrigger>
          <TabsTrigger value="favorites" data-testid="tab-favorites">
            <Heart className="h-4 w-4 mr-2" />
            Favorieten
          </TabsTrigger>
          <TabsTrigger value="vehicle" data-testid="tab-vehicle">
            <Car className="h-4 w-4 mr-2" />
            Voertuig
          </TabsTrigger>
          <TabsTrigger value="create" data-testid="tab-create">
            <Plus className="h-4 w-4 mr-2" />
            Route Maken
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recente Activiteit
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.completedRoutes?.slice(0, 3).map((route: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{route.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(route.completedAt).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{route.rating}</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">
                    Nog geen routes voltooid
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Bookmarked Routes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Opgeslagen Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.bookmarkedRoutes?.slice(0, 3).map((route: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{route.title}</p>
                      <p className="text-sm text-gray-500">{route.category}</p>
                    </div>
                    <Badge variant="secondary">
                      {route.distance}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">
                    Nog geen routes opgeslagen
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voltooide Routes</CardTitle>
              <CardDescription>
                Routes die je al hebt afgerond, met je beoordelingen en notities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.completedRoutes?.length ? (
                <div className="space-y-4">
                  {profile.completedRoutes.map((route: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4" data-testid={`completed-route-${index}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{route.title}</h3>
                          <p className="text-sm text-gray-500">{route.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{route.rating}</span>
                          </div>
                          <Badge variant="outline">
                            {new Date(route.completedAt).toLocaleDateString('nl-NL')}
                          </Badge>
                        </div>
                      </div>
                      
                      {route.notes && (
                        <p className="text-sm text-gray-600 mb-2">{route.notes}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{route.distance}</Badge>
                        <Badge variant="secondary">{route.duration}</Badge>
                        {route.wouldRecommend && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Aangeraden
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Route className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen routes voltooid</h3>
                  <p className="text-gray-500 mb-4">Begin je eerste route om hier je reiservaringen te zien.</p>
                  <Button onClick={() => window.location.href = '/'}>
                    Ontdek Routes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Favoriete Locaties</CardTitle>
              <CardDescription>
                Je opgeslagen restaurants, kastelen, foto spots en andere interessante plekken.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile?.favoriteLocations?.map((location: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4" data-testid={`favorite-location-${index}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{location.name}</h3>
                          <Badge variant="outline">{location.category}</Badge>
                          {location.instagramWorthy && (
                            <Camera className="h-4 w-4 text-pink-500" />
                          )}
                          {location.evFriendly && (
                            <Zap className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        
                        {location.description && (
                          <p className="text-sm text-gray-500 mb-2">{location.description}</p>
                        )}
                        
                        {location.notes && (
                          <p className="text-sm text-blue-600 italic">"{location.notes}"</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {location.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{location.rating}</span>
                          </div>
                        )}
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen favoriete locaties</h3>
                    <p className="text-gray-500 mb-4">Voeg je favoriete restaurants, kastelen en foto spots toe.</p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Locatie Toevoegen
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Tab */}
        <TabsContent value="vehicle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voertuig Voorkeuren</CardTitle>
              <CardDescription>
                Stel je voertuigtype in om relevante tankstations, laadpalen en routes te zien.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType">Voertuigtype</Label>
                    <Select name="vehicleType" defaultValue={profile?.vehiclePreferences?.vehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer voertuigtype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Auto</SelectItem>
                        <SelectItem value="ev">Elektrische Auto</SelectItem>
                        <SelectItem value="motorcycle">Motor</SelectItem>
                        <SelectItem value="camper">Camper</SelectItem>
                        <SelectItem value="bicycle">Fiets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fuelType">Brandstoftype</Label>
                    <Select name="fuelType" defaultValue={profile?.vehiclePreferences?.fuelType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer brandstoftype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Benzine</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Elektrisch</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                        <SelectItem value="hydrogen">Waterstof</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    name="needsCharging" 
                    defaultChecked={profile?.vehiclePreferences?.needsCharging}
                  />
                  <Label htmlFor="needsCharging">Heeft laadmogelijkheden nodig</Label>
                </div>

                <div>
                  <Label htmlFor="chargingType">Laadtype (indien van toepassing)</Label>
                  <Select name="chargingType" defaultValue={profile?.vehiclePreferences?.chargingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer laadtype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                      <SelectItem value="ccs">CCS</SelectItem>
                      <SelectItem value="chademo">CHAdeMO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferredBrands">Voorkeur Merken (kommagescheiden)</Label>
                  <Input
                    name="preferredBrands"
                    placeholder="Shell, BP, Fastned, etc."
                    defaultValue={profile?.vehiclePreferences?.preferredBrands?.join(', ')}
                  />
                </div>

                <Button type="submit" disabled={vehicleMutation.isPending}>
                  {vehicleMutation.isPending ? (
                    <>Opslaan...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Voorkeuren Opslaan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Route Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nieuwe Route Maken</CardTitle>
              <CardDescription>
                Maak je eigen route met favoriete stops en interessante locaties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Route className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Route Maker</h3>
                <p className="text-gray-500 mb-4">
                  Deze functie is binnenkort beschikbaar. Je kunt dan je eigen routes maken met kastelen, restaurants en foto spots.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Voeg favoriete restaurants toe</p>
                  <p>• Selecteer kastelen om te bezoeken</p>
                  <p>• Markeer Instagram-waardige foto spots</p>
                  <p>• Voeg tankstations en laadpalen toe</p>
                  <p>• Plan overnachtingen in B&B's</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}