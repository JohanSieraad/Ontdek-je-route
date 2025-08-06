import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Heart, Users, Clock, MapPin } from "lucide-react";

const preferencesSchema = z.object({
  preferredCategories: z.array(z.string()).default([]),
  preferredDifficulty: z.string().default("gemakkelijk"),
  preferredDuration: z.string().default("2-4 uur"),
  preferredDistance: z.string().default("50-100 km"),
  preferredRegions: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  travelStyle: z.string().default("relaxed"),
  groupSize: z.number().min(1).max(20).default(2),
  hasChildren: z.boolean().default(false),
  budgetRange: z.string().default("middel"),
  accessibilityNeeds: z.array(z.string()).default([]),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

const categories = [
  "Kastelen & Eten",
  "Dorpjes & Fotografie", 
  "Bier & Cultuur",
  "Strand & Restaurants",
  "Eilanden & Zee",
  "Nederlandse Cultuur",
  "Natuur & Fotografie"
];

const interests = [
  "kastelen",
  "natuur", 
  "cultuur",
  "eten",
  "fotografie",
  "geschiedenis",
  "familie",
  "romantisch",
  "avontuur",
  "ontspanning"
];

const regions = [
  "Noord-Holland",
  "Zuid-Holland", 
  "Zeeland",
  "Gelderland",
  "België - Ardennen",
  "België - Kust",
  "Duitsland - Zwarte Woud",
  "Luxemburg"
];

const accessibilityOptions = [
  "rolstoel toegankelijk",
  "beperkte mobiliteit",
  "visuele ondersteuning",
  "rustige omgeving"
];

export function PreferencesForm() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["/api/preferences"],
    enabled: isAuthenticated,
    retry: false,
  });

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredCategories: [],
      preferredDifficulty: "gemakkelijk",
      preferredDuration: "2-4 uur",
      preferredDistance: "50-100 km",
      preferredRegions: [],
      interests: [],
      travelStyle: "relaxed",
      groupSize: 2,
      hasChildren: false,
      budgetRange: "middel",
      accessibilityNeeds: [],
    },
  });

  // Update form when preferences are loaded
  useEffect(() => {
    if (preferences) {
      form.reset(preferences);
    }
  }, [preferences, form]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormData) => {
      await apiRequest("/api/preferences", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  const onSubmit = (data: PreferencesFormData) => {
    savePreferencesMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-800">Voorkeuren Instellen</CardTitle>
          <CardDescription className="text-gray-600">
            Log in om je route voorkeuren in te stellen en betere aanbevelingen te krijgen.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-800">Route Voorkeuren</CardTitle>
              <CardDescription className="text-gray-600">
                Pas je voorkeuren aan voor betere aanbevelingen
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            {isExpanded ? "Inklappen" : "Uitbreiden"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Travel Style */}
              <FormField
                control={form.control}
                name="travelStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Reisstijl
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kies je reisstijl" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="relaxed">Ontspannen</SelectItem>
                        <SelectItem value="adventure">Avontuurlijk</SelectItem>
                        <SelectItem value="cultural">Cultureel</SelectItem>
                        <SelectItem value="family">Familie</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Group Size */}
              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Groepsgrootte: {field.value} personen
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preferred Categories */}
              <FormField
                control={form.control}
                name="preferredCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favoriete Categorieën</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={field.value.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = field.value || [];
                            const updated = current.includes(category)
                              ? current.filter(c => c !== category)
                              : [...current, category];
                            field.onChange(updated);
                          }}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Preference */}
              <FormField
                control={form.control}
                name="preferredDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Voorkeur Duur
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kies tijdsduur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-2 uur">1-2 uur</SelectItem>
                        <SelectItem value="2-4 uur">2-4 uur</SelectItem>
                        <SelectItem value="4-6 uur">4-6 uur</SelectItem>
                        <SelectItem value="6-8 uur">6-8 uur</SelectItem>
                        <SelectItem value="hele dag">Hele dag</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Distance Preference */}
              <FormField
                control={form.control}
                name="preferredDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Voorkeur Afstand
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kies afstand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="25-50 km">25-50 km</SelectItem>
                        <SelectItem value="50-100 km">50-100 km</SelectItem>
                        <SelectItem value="100-150 km">100-150 km</SelectItem>
                        <SelectItem value="150+ km">150+ km</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interests */}
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interesses</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={field.value.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = field.value || [];
                            const updated = current.includes(interest)
                              ? current.filter(i => i !== interest)
                              : [...current, interest];
                            field.onChange(updated);
                          }}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Has Children */}
              <FormField
                control={form.control}
                name="hasChildren"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Reizen met kinderen</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={savePreferencesMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {savePreferencesMutation.isPending ? "Opslaan..." : "Voorkeuren Opslaan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Sluiten
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
}