import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema, type ChargingStation, type Brand, type InfoCategory, type InfoItem, type InsertLead } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Zap, Wrench, Euro, Smartphone, Phone, Mail, MapPin, Car, Clock, CheckCircle, ArrowRight, Star } from "lucide-react";

const iconMap = {
  Zap,
  Wrench,
  Euro,
  Smartphone,
};

export default function LaadpaalFunnel() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: chargingStations } = useQuery<ChargingStation[]>({
    queryKey: ["/api/charging-stations"],
  });

  const { data: infoCategories } = useQuery<InfoCategory[]>({
    queryKey: ["/api/info-categories"],
  });

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      postcode: "",
      housingSituation: "",
      currentCar: "",
      plannedCar: "",
      installationNeeded: 0,
      budget: "",
      timeframe: "",
      notes: "",
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: (data: InsertLead) => apiRequest("/api/leads", "POST", data),
    onSuccess: () => {
      toast({
        title: "Bedankt voor uw interesse!",
        description: "We nemen binnen 24 uur contact met u op voor een persoonlijk advies.",
      });
      form.reset();
      setShowLeadForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
    onError: () => {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het opnieuw of neem contact met ons op.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertLead) => {
    createLeadMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-laadpaal-gray to-white">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-laadpaal-blue" />
              <h1 className="text-2xl font-bold text-laadpaal-dark">De Laadpaalshop</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-laadpaal-blue" />
              <span className="text-laadpaal-dark">Bel voor advies</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-laadpaal-blue to-laadpaal-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Uw Onafhankelijke<br />
            <span className="text-laadpaal-accent">Laadpaal Specialist</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Bij ons kunt u terecht voor een laadpaal voor thuis en het MKB. 
            Wij bieden persoonlijk advies en installatie over heel Nederland.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-laadpaal-orange hover:bg-laadpaal-orange/90 text-white px-8 py-6 text-lg"
              onClick={() => setShowLeadForm(true)}
              data-testid="button-lead-form"
            >
              <Zap className="mr-2 h-5 w-5" />
              Gratis Advies Aanvragen
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-laadpaal-blue px-8 py-6 text-lg"
              onClick={() => setShowProducts(true)}
              data-testid="button-view-products"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Bekijk Laadpalen
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-laadpaal-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Persoonlijk Advies</h3>
              <p className="text-gray-600">Wij nemen de tijd voor u en geven advies op maat</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-laadpaal-orange mb-4" />
              <h3 className="text-xl font-semibold mb-2">Erkende Merken</h3>
              <p className="text-gray-600">Alleen de beste kwaliteit van betrouwbare fabrikanten</p>
            </div>
            <div className="flex flex-col items-center">
              <Wrench className="h-12 w-12 text-laadpaal-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Complete Installatie</h3>
              <p className="text-gray-600">Van advies tot installatie, alles uit één hand</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="py-12 bg-laadpaal-gray">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-laadpaal-dark">Onze Premium Merken</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
            {brands?.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="max-h-12 w-auto object-contain"
                  data-testid={`logo-${brand.name.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informatie Sectie */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-laadpaal-dark">
            Alles wat u moet weten over laadpalen
          </h2>
          
          {infoCategories && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {infoCategories.map((category) => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Zap;
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow" data-testid={`info-category-${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-8 w-8 text-laadpaal-blue" />
                        <div>
                          <CardTitle className="text-xl">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <InfoCategoryItems categoryId={category.id} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Populaire Laadpalen Sectie */}
      {showProducts && (
        <section className="py-16 bg-laadpaal-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-laadpaal-dark">
              Populaire Laadpalen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {chargingStations?.filter(station => station.isPopular).map((station) => (
                <Card key={station.id} className="hover:shadow-lg transition-shadow" data-testid={`product-${station.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader>
                    <img 
                      src={station.imageUrl} 
                      alt={station.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-2">{station.power}</Badge>
                      <h3 className="text-xl font-semibold">{station.name}</h3>
                      <p className="text-gray-600 mt-2">{station.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-laadpaal-blue">
                        €{station.price.toFixed(2)}
                      </span>
                      <Button 
                        className="bg-laadpaal-orange hover:bg-laadpaal-orange/90"
                        onClick={() => setShowLeadForm(true)}
                        data-testid={`button-interest-${station.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        Interesse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Form Modal/Section */}
      {showLeadForm && (
        <section className="py-16 bg-white border-t-4 border-laadpaal-blue">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-laadpaal-dark">
                Ontvang uw persoonlijke laadpaal advies
              </h2>
              <p className="text-lg text-gray-600">
                Vul onderstaand formulier in en onze experts nemen binnen 24 uur contact met u op
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-lead">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naam *</FormLabel>
                        <FormControl>
                          <Input placeholder="Uw volledige naam" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input placeholder="uw@email.nl" type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefoon</FormLabel>
                        <FormControl>
                          <Input placeholder="06-12345678" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 AB" {...field} data-testid="input-postcode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="housingSituation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Woonsituatie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-housing">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="eigen_huis">Eigen huis</SelectItem>
                            <SelectItem value="huur">Huurwoning</SelectItem>
                            <SelectItem value="bedrijf">Bedrijfspand</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gewenste tijdlijn</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-timeframe">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="binnen_1_maand">Binnen 1 maand</SelectItem>
                            <SelectItem value="1_3_maanden">1-3 maanden</SelectItem>
                            <SelectItem value="3_6_maanden">3-6 maanden</SelectItem>
                            <SelectItem value="nog_onbekend">Nog onbekend</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currentCar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Huidige auto</FormLabel>
                        <FormControl>
                          <Input placeholder="Bijv. Tesla Model 3" {...field} data-testid="input-current-car" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget indicatie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-budget">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tot_1000">Tot €1.000</SelectItem>
                            <SelectItem value="1000_1500">€1.000 - €1.500</SelectItem>
                            <SelectItem value="1500_2500">€1.500 - €2.500</SelectItem>
                            <SelectItem value="boven_2500">Boven €2.500</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aanvullende opmerkingen</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Heeft u specifieke wensen of vragen?" 
                          className="min-h-[100px]"
                          {...field} 
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="installationNeeded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value === 1}
                            onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                            data-testid="checkbox-installation"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Ik heb ook installatie nodig
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    className="bg-laadpaal-blue hover:bg-laadpaal-blue/90 flex-1"
                    disabled={createLeadMutation.isPending}
                    data-testid="button-submit-lead"
                  >
                    {createLeadMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Verstuur Aanvraag
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowLeadForm(false)}
                    data-testid="button-cancel-form"
                  >
                    Annuleren
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-laadpaal-dark text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-6 w-6" />
            <span className="text-xl font-semibold">De Laadpaalshop</span>
          </div>
          <p className="text-gray-300 mb-4">
            Uw onafhankelijke laadpaal specialist voor heel Nederland
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span>Privacy Beleid</span>
            <span>•</span>
            <span>Over Ons</span>
            <span>•</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for info category items
function InfoCategoryItems({ categoryId }: { categoryId: string }) {
  const { data: infoItems } = useQuery<InfoItem[]>({
    queryKey: ["/api/info-items", categoryId],
  });

  if (!infoItems?.length) {
    return (
      <div className="text-gray-500 italic">
        Informatie wordt geladen...
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {infoItems.map((item, index) => (
        <AccordionItem key={item.id} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <p className="text-gray-600">{item.content}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}