import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Menu, Search, Home, Globe, Route, Info, Calendar, ChevronDown } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;
  
  const navigate = (path: string) => {
    // Handle anchor links by scrolling to element
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // Use window.location for route changes
    window.location.pathname = path;
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "#regio", label: "Regio's", icon: Globe },
  ];

  const bottomNavLinks = [
    { href: "#about", label: "Over Ons", icon: Info },
  ];

  const routeDropdownLinks = [
    { href: "#routes", label: "Dagroutes", icon: Route },
    { href: "/multi-day-routes", label: "Meerdaagse Routes", icon: Calendar },
  ];

  const countryNavLinks = [
    { 
      href: "/region/nederland", 
      label: "Nederland",
      flag: (
        <svg viewBox="0 0 9 6" className="w-full h-full">
          <rect width="9" height="2" fill="#AE1C28"/>
          <rect width="9" height="2" y="2" fill="#FFFFFF"/>
          <rect width="9" height="2" y="4" fill="#21468B"/>
        </svg>
      )
    },
    { 
      href: "/region/belgie", 
      label: "België",
      flag: (
        <svg viewBox="0 0 15 10" className="w-full h-full">
          <rect width="5" height="10" fill="#000000"/>
          <rect x="5" width="5" height="10" fill="#FFD700"/>
          <rect x="10" width="5" height="10" fill="#FF0000"/>
        </svg>
      )
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center space-x-2 cursor-pointer group" data-testid="link-home">
            <MapPin className="h-8 w-8 text-dutch-orange group-hover:animate-wiggle transition-all duration-200" />
            <h1 className="text-xl font-bold text-gray-900 group-hover:text-dutch-orange transition-colors duration-200">AutoRoutes Nederland</h1>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Main Menu Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-dutch-orange transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50" data-testid="button-main-menu">
                <Menu className="h-4 w-4" />
                <span className="text-sm">Menu</span>
                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {/* Navigation Links */}
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <button
                        key={link.href}
                        onClick={() => navigate(link.href)}
                        className={`flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-dutch-orange transition-colors text-left ${
                          isActive(link.href) ? 'text-dutch-orange bg-orange-50' : ''
                        }`}
                        data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <IconComponent className="h-4 w-4 mr-3" />
                        {link.label}
                      </button>
                    );
                  })}
                  
                  {/* Routes Section */}
                  <div className="border-t mt-2 pt-2">
                    <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Routes</div>
                    {routeDropdownLinks.map((routeLink) => {
                      const IconComponent = routeLink.icon;
                      return (
                        <button
                          key={routeLink.href}
                          onClick={() => navigate(routeLink.href)}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-dutch-orange transition-colors text-left"
                          data-testid={`link-${routeLink.label.toLowerCase().replace(' ', '-')}`}
                        >
                          <IconComponent className="h-4 w-4 mr-3" />
                          {routeLink.label}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Countries Section */}
                  <div className="border-t mt-2 pt-2">
                    <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Landen</div>
                    {countryNavLinks.map((country) => (
                      <button
                        key={country.href}
                        onClick={() => navigate(country.href)}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-dutch-orange transition-colors text-left"
                        data-testid={`link-${country.label.toLowerCase()}`}
                      >
                        <div className="w-6 h-4 mr-3 border border-gray-300 rounded-sm overflow-hidden">
                          {country.flag}
                        </div>
                        {country.label}
                      </button>
                    ))}
                  </div>

                  {/* Bottom Navigation Section */}
                  <div className="border-t mt-2 pt-2">
                    {bottomNavLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <button
                          key={link.href}
                          onClick={() => navigate(link.href)}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-dutch-orange transition-colors text-left"
                          data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                        >
                          <IconComponent className="h-4 w-4 mr-3" />
                          {link.label}
                        </button>
                      );
                    })}
                  </div>
                  

                </div>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-dutch-orange to-sunset-pink text-white hover:from-dutch-orange/90 hover:to-sunset-pink/90 shadow-lg px-3 py-2" data-testid="button-search">
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">Zoek Routes</span>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-2 mt-8">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => {
                        navigate(link.href);
                        setIsOpen(false);
                      }}
                      className={`text-gray-700 hover:text-dutch-orange transition-colors font-medium flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 w-full text-left ${
                        isActive(link.href) ? 'text-dutch-orange bg-orange-50' : ''
                      }`}
                      data-testid={`mobile-link-${link.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <IconComponent className="h-5 w-5" />
                      {link.label}
                    </button>
                  );
                })}
                
                {/* Mobile Routes Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-gray-600 font-medium text-sm px-2 mb-2">Routes</h3>
                  {routeDropdownLinks.map((routeLink) => {
                    const IconComponent = routeLink.icon;
                    return (
                      <button
                        key={routeLink.href}
                        onClick={() => {
                          navigate(routeLink.href);
                          setIsOpen(false);
                        }}
                        className="text-gray-700 hover:text-dutch-orange transition-colors font-medium flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 w-full text-left"
                        data-testid={`mobile-link-${routeLink.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <IconComponent className="h-5 w-5" />
                        {routeLink.label}
                      </button>
                    );
                  })}
                </div>
                
                {/* Mobile Countries Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-gray-600 font-medium text-sm px-2 mb-2">Landen</h3>
                  {countryNavLinks.map((country) => (
                    <button
                      key={country.href}
                      onClick={() => {
                        navigate(country.href);
                        setIsOpen(false);
                      }}
                      className="text-gray-700 hover:text-dutch-orange transition-colors font-medium flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-50 w-full text-left"
                      data-testid={`mobile-link-${country.label.toLowerCase()}`}
                    >
                      <div className="w-6 h-4 border border-gray-300 rounded-sm overflow-hidden">
                        {country.flag}
                      </div>
                      {country.label}
                    </button>
                  ))}
                </div>
                
                <Button className="bg-dutch-orange text-white hover:bg-dutch-orange/90 mt-6 flex items-center justify-center gap-2" data-testid="mobile-button-search">
                  <Search className="h-4 w-4" />
                  Zoek Routes
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      

    </header>
  );
}
