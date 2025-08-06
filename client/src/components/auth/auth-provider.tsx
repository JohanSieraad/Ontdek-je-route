import { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User, RegisterData, LoginData } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authData = useAuth();

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
}