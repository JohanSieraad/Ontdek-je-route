import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';

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

  const logout = async () => {
    localStorage.removeItem('authToken');
    queryClient.setQueryData(['/api/auth/me'], null);
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    window.location.reload();
  };

  const isAuthenticated = !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
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