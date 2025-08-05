import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertRouteSchema, type InsertRoute, type Region } from "@shared/schema";

interface CreateRouteFormProps {
  defaultRegionId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateRouteForm({ defaultRegionId, onSuccess, onCancel }: CreateRouteFormProps) {
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch regions for dropdown
  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const form = useForm<InsertRoute>({
    resolver: zodResolver(insertRouteSchema.omit({ isUserCreated: true, createdBy: true })),
    defaultValues: {
      title: "",
      description: "",
      regionId: defaultRegionId || "",
      category: "",
      duration: "",
      distance: "",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      difficulty: "gemakkelijk",
    },
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
      toast({
        title: "Route Toegevoegd",
        description: "Je nieuwe route is succesvol aangemaakt!",
      });
      onSuccess();
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Er ging iets mis");
    },
  });

  const onSubmit = async (data: InsertRoute) => {
    setError("");
    createMutation.mutate(data);
  };

  const categories = [
    "Kastelen & Eten",
    "Dorpjes & Fotografie", 
    "Bier & Cultuur",
    "Strand & Restaurants",
    "Natuur & Wildlife",
    "Geschiedenis"
  ];

  const difficulties = [
    { value: "gemakkelijk", label: "Gemakkelijk" },
    { value: "gemiddeld", label: "Gemiddeld" },
    { value: "uitdagend", label: "Uitdagend" },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Route Naam</Label>
          <Input
            {...form.register("title")}
            id="title"
            placeholder="Bijv. Kastelen Route Gelderland"
            data-testid="route-title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="regionId">Regio</Label>
          <Select
            value={form.watch("regionId")}
            onValueChange={(value) => form.setValue("regionId", value)}
          >
            <SelectTrigger data-testid="route-region">
              <SelectValue placeholder="Selecteer een regio" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.regionId && (
            <p className="text-sm text-red-600">{form.formState.errors.regionId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          {...form.register("description")}
          id="description"
          placeholder="Beschrijf je route, wat kunnen bezoekers verwachten?"
          rows={3}
          data-testid="route-description"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categorie</Label>
          <Select
            value={form.watch("category")}
            onValueChange={(value) => form.setValue("category", value)}
          >
            <SelectTrigger data-testid="route-category">
              <SelectValue placeholder="Selecteer categorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duur</Label>
          <Input
            {...form.register("duration")}
            id="duration"
            placeholder="Bijv. 4 uur"
            data-testid="route-duration"
          />
          {form.formState.errors.duration && (
            <p className="text-sm text-red-600">{form.formState.errors.duration.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance">Afstand</Label>
          <Input
            {...form.register("distance")}
            id="distance"
            placeholder="Bijv. 120 km"
            data-testid="route-distance"
          />
          {form.formState.errors.distance && (
            <p className="text-sm text-red-600">{form.formState.errors.distance.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Moeilijkheidsgraad</Label>
          <Select
            value={form.watch("difficulty")}
            onValueChange={(value) => form.setValue("difficulty", value)}
          >
            <SelectTrigger data-testid="route-difficulty">
              <SelectValue placeholder="Selecteer moeilijkheid" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.difficulty && (
            <p className="text-sm text-red-600">{form.formState.errors.difficulty.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Afbeelding URL (optioneel)</Label>
          <Input
            {...form.register("imageUrl")}
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            data-testid="route-image"
          />
          {form.formState.errors.imageUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.imageUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createMutation.isPending}
          data-testid="cancel-route"
        >
          <X className="w-4 h-4 mr-2" />
          Annuleren
        </Button>
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-orange-500 hover:bg-orange-600"
          data-testid="save-route"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Opslaan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Route Opslaan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}