import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthDialog({ isOpen, onClose, defaultMode = "login" }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  const handleSwitchMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0" aria-describedby="auth-dialog-description">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>
              {mode === "login" ? "Inloggen" : "Registreren"}
            </DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div id="auth-dialog-description" className="sr-only">
          {mode === "login" 
            ? "Log in om je routes te beheren" 
            : "Maak een account aan om routes te maken"
          }
        </div>
        {mode === "login" ? (
          <LoginForm
            onSwitchToRegister={handleSwitchMode}
            onClose={onClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={handleSwitchMode}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}