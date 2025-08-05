import { MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const quickLinks = [
    { href: "#regions", label: "Alle Regio's" },
    { href: "#routes", label: "Populaire Routes" },
    { href: "#map", label: "Interactieve Kaart" },
    { href: "#audio", label: "Audio Gidsen" },
  ];

  const contactLinks = [
    { href: "#about", label: "Over Ons" },
    { href: "#contact", label: "Contact" },
    { href: "#privacy", label: "Privacy" },
    { href: "#terms", label: "Voorwaarden" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-dutch-orange" />
              <h2 className="text-xl font-bold">Nederlandse Routes</h2>
            </div>
            <p className="text-gray-300 mb-4" data-testid="text-footer-description">
              Ontdek de rijke geschiedenis van Nederland door onze zorgvuldig samengestelde historische routes. 
              Van kastelen tot molens, van steden tot dorpen - er is altijd iets nieuws te ontdekken.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="text-gray-300 hover:text-dutch-orange transition-colors"
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-dutch-orange transition-colors"
                    data-testid={`link-quick-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Info</h3>
            <ul className="space-y-2">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-dutch-orange transition-colors"
                    data-testid={`link-contact-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p data-testid="text-copyright">
            &copy; 2024 Nederlandse Routes. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
