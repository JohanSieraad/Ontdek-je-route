import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Edit, Plus, Car, MapPin, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/auth/auth-provider";
import type { Route, Region, InsertRoute } from "@shared/schema";

export default function ManageRoutes() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertRoute>>({
    title: "",
    description: "",
    regionId: "",
    category: "",
    duration: "",
    distance: "",
    imageUrl: "",
    difficulty: "gemakkelijk",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [authLoading, isAuthenticated]);

  // Fetch all routes and regions
  const { data: routes = [], isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  // Create route mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertRoute) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create route");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Route aangemaakt",
        description: "Je nieuwe route is succesvol toegevoegd!",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het aanmaken van de route.",
        variant: "destructive",
      });
    },
  });

  // Update route mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertRoute> }) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/routes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update route");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      setIsDialogOpen(false);
      setSelectedRoute(null);
      resetForm();
      toast({
        title: "Route bijgewerkt",
        description: "De route is succesvol bijgewerkt!",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het bijwerken van de route.",
        variant: "destructive",
      });
    },
  });

  // Delete route mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/routes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete route");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({
        title: "Route verwijderd",
        description: "De route is succesvol verwijderd.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het verwijderen van de route.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      regionId: "",
      category: "",
      duration: "",
      distance: "",
      imageUrl: "",
      difficulty: "gemakkelijk",
    });
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setFormData({
      title: route.title,
      description: route.description,
      regionId: route.regionId,
      category: route.category,
      duration: route.duration,
      distance: route.distance,
      imageUrl: route.imageUrl,
      difficulty: route.difficulty,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.regionId) {
      toast({
        title: "Ontbrekende velden",
        description: "Vul alle verplichte velden in.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRoute) {
      updateMutation.mutate({ id: selectedRoute.id, data: formData as InsertRoute });
    } else {
      createMutation.mutate(formData as InsertRoute);
    }
  };

  const userCreatedRoutes = routes.filter(route => route.isUserCreated && route.createdBy === user?.id);

  if (authLoading || routesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Laden...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Je moet ingelogd zijn om je routes te beheren. 
            <a href="/" className="ml-1 text-orange-600 hover:text-orange-700 underline">
              Ga terug naar de homepage
            </a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Route Beheer</h1>
        <p className="text-gray-600">Beheer je eigen autoroutes door Nederland en België</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mijn Routes ({userCreatedRoutes.length})</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedRoute(null);
                resetForm();
              }}
              data-testid="button-add-route"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedRoute ? "Route Bewerken" : "Nieuwe Route Toevoegen"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Route Titel *</Label>
                <Input
                  id="title"
                  data-testid="input-route-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bijv. Kastelen Route Amsterdam"
                />
              </div>

              <div>
                <Label htmlFor="description">Beschrijving *</Label>
                <Textarea
                  id="description"
                  data-testid="input-route-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschrijf je route en wat bezoekers kunnen verwachten..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Regio *</Label>
                  <Select 
                    value={formData.regionId} 
                    onValueChange={(value) => setFormData({ ...formData, regionId: value })}
                  >
                    <SelectTrigger data-testid="select-region">
                      <SelectValue placeholder="Kies een regio" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categorie</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Kies categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kastelen & Eten">Kastelen & Eten</SelectItem>
                      <SelectItem value="Dorpjes & Fotografie">Dorpjes & Fotografie</SelectItem>
                      <SelectItem value="Bier & Cultuur">Bier & Cultuur</SelectItem>
                      <SelectItem value="Strand & Restaurants">Strand & Restaurants</SelectItem>
                      <SelectItem value="Natuur & Ontspanning">Natuur & Ontspanning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duur</Label>
                  <Input
                    id="duration"
                    data-testid="input-duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Bijv. 4-6 uur"
                  />
                </div>

                <div>
                  <Label htmlFor="distance">Afstand</Label>
                  <Input
                    id="distance"
                    data-testid="input-distance"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="Bijv. 125 km"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Moeilijkheid</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger data-testid="select-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemakkelijk">Gemakkelijk</SelectItem>
                      <SelectItem value="gemiddeld">Gemiddeld</SelectItem>
                      <SelectItem value="uitdagend">Uitdagend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Afbeelding URL</Label>
                <Input
                  id="imageUrl"
                  data-testid="input-image-url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/route-image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Annuleren
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-route"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {selectedRoute ? "Bijwerken" : "Aanmaken"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {userCreatedRoutes.length === 0 ? (
        <Card className="p-8 text-center">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nog geen eigen routes</h3>
          <p className="text-gray-600 mb-4">
            Begin met het maken van je eerste autoroute door Nederland of België
          </p>
          <Button 
            onClick={() => {
              setSelectedRoute(null);
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-600"
            data-testid="button-create-first-route"
          >
            <Plus className="w-4 h-4 mr-2" />
            Eerste Route Maken
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userCreatedRoutes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-purple-100 rounded-t-lg relative overflow-hidden">
                {route.imageUrl ? (
                  <img 
                    src={route.imageUrl} 
                    alt={route.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <MapPin className="w-12 h-12 text-orange-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(route)}
                    data-testid={`button-edit-route-${route.id}`}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(route.id)}
                    data-testid={`button-delete-route-${route.id}`}
                    className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-6">{route.title}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-800 ml-2 shrink-0"
                  >
                    Eigen
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {route.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{route.duration}</span>
                    <span className="text-gray-500">{route.distance}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {route.difficulty}
                  </Badge>
                </div>

                {route.category && (
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {route.category}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}