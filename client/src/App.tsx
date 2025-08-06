import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navigation } from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Regions from "@/pages/regions";
import Region from "@/pages/region";
import RouteDetail from "@/pages/route-detail";
import ManageRoutes from "@/pages/manage-routes";
import MultiDayRoutes from "@/pages/multi-day-routes";
import MultiDayRouteDetail from "@/pages/multi-day-route-detail";



function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/regios" component={Regions} />
        <Route path="/regio/:regionId" component={Region} />
        <Route path="/route/:routeId" component={RouteDetail} />
        <Route path="/meerdaagse-routes" component={MultiDayRoutes} />
        <Route path="/multi-day-routes/:id" component={MultiDayRouteDetail} />
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
