import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-md p-0 gap-0">
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