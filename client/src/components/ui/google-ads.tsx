import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Info } from "lucide-react";

interface GoogleAdProps {
  position: "header" | "sidebar" | "footer" | "content";
  className?: string;
}

// Simulated ad content - in production this would be Google AdSense
const adContent = {
  header: {
    title: "Boek je verblijf bij Kasteel Hotels",
    description: "Exclusieve kasteel hotels in Nederland & België. Tot 30% korting!",
    url: "booking.com/kasteel-hotels",
    type: "Gesponsord" as const
  },
  sidebar: {
    title: "Reisverzekering vanaf €2,50",
    description: "Volledig gedekt tijdens je Nederlandse route reis.",
    url: "europ-assistance.nl",
    type: "Advertentie" as const
  },
  footer: {
    title: "Autoverhuur vanaf €19/dag",
    description: "Ideaal voor jouw route door Nederland. Gratis annulering!",
    url: "rentalcars.com/nederland",
    type: "Gesponsord" as const
  },
  content: {
    title: "Restaurant reserveringen",
    description: "Reserveer nu de beste restaurants langs je route.",
    url: "opentable.nl/restaurants",
    type: "Advertentie" as const
  }
};

export function GoogleAd({ position, className = "" }: GoogleAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [ad] = useState(adContent[position]);

  // Hide ad after user dismisses it
  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Don't render if dismissed
  if (!isVisible) return null;

  return (
    <Card 
      className={`relative p-4 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 ${className}`}
      data-testid={`google-ad-${position}`}
    >
      {/* Ad label */}
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs flex items-center gap-1" data-testid={`badge-ad-${position}`}>
          <Info className="h-3 w-3" />
          {ad.type}
        </Badge>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Advertentie sluiten"
          data-testid={`button-close-ad-${position}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Ad content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-foreground" data-testid={`title-ad-${position}`}>
          {ad.title}
        </h3>
        <p className="text-xs text-muted-foreground" data-testid={`description-ad-${position}`}>
          {ad.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-600 font-medium" data-testid={`url-ad-${position}`}>
            {ad.url}
          </span>
          <Badge variant="outline" className="text-xs">
            Bekijk aanbieding
          </Badge>
        </div>
      </div>
    </Card>
  );
}

// Header banner ad component
export function HeaderAd() {
  return (
    <div className="w-full bg-gradient-to-r from-orange-100 to-blue-100 border-b" data-testid="header-ad-banner">
      <div className="container mx-auto px-4 py-2">
        <GoogleAd position="header" className="border-none bg-transparent p-2" />
      </div>
    </div>
  );
}

// Sidebar ad component
export function SidebarAd() {
  return (
    <div className="sticky top-4" data-testid="sidebar-ad-container">
      <GoogleAd position="sidebar" className="mb-4" />
    </div>
  );
}

// Footer ad component
export function FooterAd() {
  return (
    <div className="w-full bg-muted/50 py-4" data-testid="footer-ad-container">
      <div className="container mx-auto px-4">
        <GoogleAd position="footer" />
      </div>
    </div>
  );
}

// Content ad component (inline with content)
export function ContentAd() {
  return (
    <div className="my-6" data-testid="content-ad-container">
      <GoogleAd position="content" />
    </div>
  );
}