import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings, Home as HomeIcon, Map, User, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "@/components/auth/auth-provider";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Region from "@/pages/region";
import RouteDetail from "@/pages/route-detail";
import ManageRoutes from "@/pages/manage-routes";

function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openLogin = () => {
    setAuthMode("login");
    setAuthDialogOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthDialogOpen(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Map className="w-8 h-8 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">Nederlandse Routes</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-3">
              {/* Navigation items */}
              <Link href="/">
                <Button
                  variant={location === "/" ? "default" : "ghost"}
                  size="sm"
                  className={location === "/" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  data-testid="nav-home"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>

              {isAuthenticated && (
                <Link href="/beheer">
                  <Button
                    variant={location === "/beheer" ? "default" : "ghost"}
                    size="sm"
                    className={location === "/beheer" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    data-testid="nav-mijn-routes"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Mijn Routes
                  </Button>
                </Link>
              )}

              {/* Auth buttons */}
              {isLoading ? (
                <div className="w-24 h-9 bg-gray-200 animate-pulse rounded"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Hallo, {user?.firstName || user?.displayName}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Uitloggen
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openLogin}
                    data-testid="login-button"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Inloggen
                  </Button>
                  <Button
                    size="sm"
                    onClick={openRegister}
                    className="bg-orange-500 hover:bg-orange-600"
                    data-testid="register-button"
                  >
                    Registreren
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        defaultMode={authMode}
      />
    </>
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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
