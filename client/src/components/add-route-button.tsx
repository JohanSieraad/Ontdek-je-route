import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateRouteForm } from "./create-route-form";
import type { User } from "@shared/schema";

interface AddRouteButtonProps {
  regionId?: string;
  regionName?: string;
  className?: string;
}

export function AddRouteButton({ regionId, regionName, className }: AddRouteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isAuthenticated = !!user;

  const handleClick = () => {
    if (isLoading) return; // Don't do anything while loading
    
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className={`bg-orange-500 hover:bg-orange-600 text-white ${className}`}
        data-testid="add-route-button"
      >
        <Plus className="w-4 h-4 mr-2" />
        {isLoading ? "Laden..." : "Route Toevoegen"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="create-route-description">
          <DialogHeader>
            <DialogTitle>
              Nieuwe Route Toevoegen
              {regionName && ` - ${regionName}`}
            </DialogTitle>
          </DialogHeader>
          <div id="create-route-description" className="sr-only">
            Maak een nieuwe autoroute aan met beschrijving, categorie en details
          </div>
          <CreateRouteForm
            defaultRegionId={regionId}
            onSuccess={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {authDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Inloggen Vereist</h3>
            <p className="text-gray-600 mb-6">
              Je moet ingelogd zijn om routes toe te voegen. 
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setAuthDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Annuleren
              </Button>
              <Button
                onClick={() => {
                  setAuthDialogOpen(false);
                  // Navigate to login
                  window.location.href = "/api/login";
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Inloggen
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}