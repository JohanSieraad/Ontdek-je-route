import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateRouteForm } from "./create-route-form";

interface AddRouteButtonProps {
  regionId?: string;
  regionName?: string;
  className?: string;
}

export function AddRouteButton({ regionId, regionName, className }: AddRouteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
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
        className={`bg-orange-500 hover:bg-orange-600 text-white ${className}`}
        data-testid="add-route-button"
      >
        <Plus className="w-4 h-4 mr-2" />
        Route Toevoegen
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
                  // This will trigger the main auth dialog in navigation
                  document.querySelector('[data-testid="login-button"]')?.click();
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