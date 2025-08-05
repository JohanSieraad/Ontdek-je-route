import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Route, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

// Background images for the carousel
const backgroundImages = [
  {
    url: 'https://images.unsplash.com/photo-1583052014411-2da88450c3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alt: 'Kinderdijk windmolens - UNESCO werelderfgoed',
    location: 'Kinderdijk Windmolens'
  },
  {
    url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alt: 'Zaanse Schans windmolens en historische huizen',
    location: 'Zaanse Schans'
  },
  {
    url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alt: 'Keukenhof tulpenvelden in volle bloei',
    location: 'Keukenhof Tulpenvelden'
  },
  {
    url: 'https://images.unsplash.com/photo-1605177019862-a78cd2bb40de?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alt: 'Giethoorn - Venetië van Nederland',
    location: 'Giethoorn Kanalen'
  },
  {
    url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alt: 'Amsterdam grachten met historische huizen',
    location: 'Amsterdam Grachten'
  },
  {
    url: 'https://images.unsplash.com/photo-1629462131018-abc19b10f099?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alt: 'Hoge Veluwe Nationaal Park bossen',
    location: 'Hoge Veluwe'
  }
];

export function HeroBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image.url}')`,
              minHeight: '500px'
            }}
            onError={(e) => console.log(`Failed to load image: ${image.url}`)}
          />
        ))}
      </div>
      
      {/* Carousel Controls */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
        data-testid="carousel-prev"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
        data-testid="carousel-next"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentImageIndex
                ? 'bg-white shadow-lg scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            data-testid={`carousel-indicator-${index}`}
          />
        ))}
      </div>
      
      {/* Location Label */}
      <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-white text-sm font-medium">
          📍 {backgroundImages[currentImageIndex].location}
        </p>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-orange-800/60"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg animate-discovery-reveal">
            Ontdek de Mooiste Autoroutes
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md animate-discovery-reveal animate-discovery-delay-1">
            Rijd langs kastelen, pittoreske dorpjes en toprestaurants in Nederland en België. 
            Compleet met parkeerplekken, fotostops en culinaire ervaringen.
          </p>
          
          {/* Country Selection with Flags */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a href="#dutch-regions">
              <Button 
                size="lg" 
                className="bg-white/95 hover:bg-white text-gray-900 border-2 border-white/30 hover:border-dutch-orange transition-all duration-300 min-w-[200px] h-16 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 interactive-hover animate-discovery-reveal animate-discovery-delay-2"
                data-testid="button-nederland"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                    <svg viewBox="0 0 9 6" className="w-full h-full">
                      <rect width="9" height="2" fill="#AE1C28"/>
                      <rect width="9" height="2" y="2" fill="#FFFFFF"/>
                      <rect width="9" height="2" y="4" fill="#21468B"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Nederland</div>
                    <div className="text-sm text-gray-500">6 regio's</div>
                  </div>
                </div>
              </Button>
            </a>
            
            <a href="#belgian-regions">
              <Button 
                size="lg" 
                className="bg-white/95 hover:bg-white text-gray-900 border-2 border-white/30 hover:border-dutch-orange transition-all duration-300 min-w-[200px] h-16 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 interactive-hover animate-discovery-reveal animate-discovery-delay-3"
                data-testid="button-belgie"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                    <svg viewBox="0 0 15 10" className="w-full h-full">
                      <rect width="5" height="10" fill="#000000"/>
                      <rect x="5" width="5" height="10" fill="#FFD700"/>
                      <rect x="10" width="5" height="10" fill="#FF0000"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">België</div>
                    <div className="text-sm text-gray-500">Ardennen</div>
                  </div>
                </div>
              </Button>
            </a>
          </div>
        </div>

        {/* Floating Discovery Stats */}
        <div className="flex justify-center space-x-4 animate-float mb-8">
          <div className="bg-gradient-to-r from-dutch-orange to-sunset-pink text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse-glow">
            🚗 22 autoroutes beschikbaar
          </div>
          <div className="bg-gradient-to-r from-royal-blue to-sky-blue text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-pulse-glow">
            📍 1.200+ km routes
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-discovery-reveal animate-discovery-delay-1">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">GPS Navigatie</h3>
            <p className="text-white/80 text-sm">Google Maps & Waze integratie voor optimale routes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4">
              <Route className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Audio Gidsen</h3>
            <p className="text-white/80 text-sm">Luister naar verhalen en geschiedenis onderweg</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Flexibele Routes</h3>
            <p className="text-white/80 text-sm">Van 2 uur wandelen tot dagtochten fietsen</p>
          </div>
        </div>
      </div>
    </div>
  );
}