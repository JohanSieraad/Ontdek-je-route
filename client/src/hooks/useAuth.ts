import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User, RegisterData, LoginData } from '@shared/schema';

interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImageUrl?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<AuthUser | null>({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      try {
        return await apiRequest('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        // If unauthorized, clear token
        if (error.message?.includes('401') || error.message?.includes('403')) {
          localStorage.removeItem('authToken');
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Store token
      localStorage.setItem('authToken', response.token);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Store token
      localStorage.setItem('authToken', response.token);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logout = async () => {
    localStorage.removeItem('authToken');
    queryClient.setQueryData(['/api/auth/me'], null);
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    window.location.reload();
  };

  const isAuthenticated = !!user && !error;

  const isAuthLoading = registerMutation.isPending || loginMutation.isPending;

  return {
    user,
    isLoading: isLoading || isAuthLoading,
    isAuthenticated,
    logout,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
  };
}

// Helper hook for authentication token
export function useAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper to get Authorization header
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Export useAuthProvider as alias for compatibility
export const useAuthProvider = useAuth;