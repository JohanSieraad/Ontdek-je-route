import { useState } from "react";
import { AuthDialog } from "./auth-dialog";

interface AuthDialogWrapperProps {
  children: React.ReactNode;
  defaultMode?: "login" | "register";
}

export function AuthDialogWrapper({ children, defaultMode = "login" }: AuthDialogWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
      <AuthDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultMode={defaultMode}
      />
    </>
  );
}