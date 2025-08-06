import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, User, LogIn, UserPlus } from "lucide-react";
import { SiFacebook, SiGoogle, SiMeta } from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, loginSchema, type RegisterData, type LoginData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface AuthDialogProps {
  children: React.ReactNode;
}

export function AuthDialog({ children }: AuthDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Succesvol ingelogd",
        description: "Welkom terug!",
      });
      
      // Store token in localStorage
      localStorage.setItem("authToken", response.token);
      
      // Close dialog and refresh page
      setOpen(false);
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Inloggen mislukt",
        description: error.message || "Er is een fout opgetreden bij het inloggen.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Account aangemaakt",
        description: "Je account is succesvol aangemaakt! Je kunt nu inloggen.",
      });
      
      // Store token in localStorage
      localStorage.setItem("authToken", response.token);
      
      // Close dialog and refresh page  
      setOpen(false);
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Registratie mislukt",
        description: error.message || "Er is een fout opgetreden bij het aanmaken van je account.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const handleSocialLogin = (provider: "google" | "facebook" | "meta") => {
    toast({
      title: "Binnenkort beschikbaar",
      description: `${provider} login wordt binnenkort toegevoegd.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Inloggen of Registreren</DialogTitle>
          <DialogDescription className="text-center">
            Maak een account aan of log in om routes te bewaren en persoonlijke aanbevelingen te krijgen.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2" data-testid="tab-login">
              <LogIn className="h-4 w-4" />
              Inloggen
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2" data-testid="tab-register">
              <UserPlus className="h-4 w-4" />
              Registreren
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" data-testid="form-login">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="je@voorbeeld.nl"
                    className="pl-10"
                    data-testid="input-login-email"
                    {...loginForm.register("email")}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-login-email">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Wachtwoord</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Wachtwoord"
                    className="pr-10"
                    data-testid="input-login-password"
                    {...loginForm.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-login-password">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login-submit"
              >
                {loginMutation.isPending ? "Inloggen..." : "Inloggen"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4" data-testid="form-register">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-firstName">Voornaam</Label>
                  <Input
                    id="register-firstName"
                    placeholder="Jan"
                    data-testid="input-register-firstName"
                    {...registerForm.register("firstName")}
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive" data-testid="error-register-firstName">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-lastName">Achternaam</Label>
                  <Input
                    id="register-lastName"
                    placeholder="de Vries"
                    data-testid="input-register-lastName"
                    {...registerForm.register("lastName")}
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive" data-testid="error-register-lastName">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="je@voorbeeld.nl"
                    className="pl-10"
                    data-testid="input-register-email"
                    {...registerForm.register("email")}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-register-email">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Wachtwoord</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimaal 6 karakters"
                    className="pr-10"
                    data-testid="input-register-password"
                    {...registerForm.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password-register"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-register-password">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
                data-testid="button-register-submit"
              >
                {registerMutation.isPending ? "Account aanmaken..." : "Account aanmaken"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Of</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin("google")}
              className="flex items-center gap-2"
              data-testid="button-google-login"
            >
              <SiGoogle className="h-4 w-4" />
              Google
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center gap-2"
              data-testid="button-facebook-login"
            >
              <SiFacebook className="h-4 w-4" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin("meta")}
              className="flex items-center gap-2"
              data-testid="button-meta-login"
            >
              <SiMeta className="h-4 w-4" />
              Meta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}