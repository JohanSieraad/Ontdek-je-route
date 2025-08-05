import { Button } from "@/components/ui/button";
import { Route, MapPin } from "lucide-react";

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-96 bg-gradient-to-r from-royal-blue to-purple-accent overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')"
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-hero-title">
            Ontdek Nederland's Rijke Geschiedenis
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="text-hero-subtitle">
            Verken historische routes door alle Nederlandse provincies en ontdek verhalen die ons land hebben gevormd.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-dutch-orange text-white hover:bg-dutch-orange/90"
              onClick={() => scrollToSection('routes')}
              data-testid="button-explore-routes"
            >
              <Route className="mr-2 h-4 w-4" />
              Routes Verkennen
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-royal-blue"
              onClick={() => scrollToSection('regions')}
              data-testid="button-view-regions"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Regio's Bekijken
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
