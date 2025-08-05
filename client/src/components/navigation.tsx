import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Menu, Search } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#regio", label: "Regio's" },
    { href: "#routes", label: "Routes" },
    { href: "#about", label: "Over Ons" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer" data-testid="link-home">
              <MapPin className="h-8 w-8 text-dutch-orange" />
              <h1 className="text-xl font-bold text-gray-900">Nederlandse Routes</h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a 
                  className={`text-gray-700 hover:text-dutch-orange transition-colors font-medium ${
                    isActive(link.href) ? 'text-dutch-orange' : ''
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Button className="bg-dutch-orange text-white hover:bg-dutch-orange/90" data-testid="button-search">
              <Search className="mr-2 h-4 w-4" />
              Zoeken
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      className={`text-gray-700 hover:text-dutch-orange transition-colors font-medium block py-2 ${
                        isActive(link.href) ? 'text-dutch-orange' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-link-${link.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                <Button className="bg-dutch-orange text-white hover:bg-dutch-orange/90 mt-4" data-testid="mobile-button-search">
                  <Search className="mr-2 h-4 w-4" />
                  Zoeken
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
