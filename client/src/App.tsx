import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings, Home as HomeIcon, Map } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Region from "@/pages/region";
import RouteDetail from "@/pages/route-detail";
import ManageRoutes from "@/pages/manage-routes";

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/beheer", label: "Mijn Routes", icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Map className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">Nederlandse Routes</span>
            </div>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  size="sm"
                  className={location === item.path ? "bg-orange-500 hover:bg-orange-600" : ""}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/regio/:regionId" component={Region} />
        <Route path="/route/:routeId" component={RouteDetail} />
        <Route path="/beheer" component={ManageRoutes} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
