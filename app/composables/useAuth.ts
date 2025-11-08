import { ref, computed } from "vue";
import type { User, LoginCredentials, RegisterData } from "~/types/auth";
import { authService } from "~/services/auth.service";

const user = ref<User | null>(null);
const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user",
} as const;

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  /**
   * Initialize auth state from storage
   */
  const initAuth = () => {
    if (import.meta.client) {
      const storedAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const storedRefreshToken = localStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN
      );
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedAccessToken && storedUser) {
        try {
          accessToken.value = storedAccessToken;
          refreshToken.value = storedRefreshToken;
          user.value = JSON.parse(storedUser);
        } catch (err) {
          console.error("Failed to parse stored user data", err);
          clearAuth();
        }
      }
    }
  };

  /**
   * Save auth data to storage
   */
  const saveAuth = (
    userData: User,
    tokens: { accessToken: string; refreshToken: string }
  ) => {
    user.value = userData;
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }
  };

  /**
   * Clear auth data from storage
   */
  const clearAuth = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;

    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      saveAuth(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return response.user;
    } catch (err: any) {
      error.value = err.message || "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Register user
   */
  const register = async (data: RegisterData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.register(data);
      saveAuth(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return response.user;
    } catch (err: any) {
      error.value = err.message || "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await authService.logout();
      clearAuth();

      // Redirect to home or login page
      if (import.meta.client) {
        navigateTo("/");
      }
    } catch (err: any) {
      error.value = err.message || "Logout failed";
      // Clear auth anyway on logout error
      clearAuth();
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh access token
   */
  const refresh = async () => {
    if (!refreshToken.value) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await authService.refreshToken(refreshToken.value);
      accessToken.value = response.accessToken;

      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      }

      return response.accessToken;
    } catch (err) {
      // If refresh fails, clear auth and redirect to login
      clearAuth();
      if (import.meta.client) {
        navigateTo("/");
      }
      throw err;
    }
  };

  /**
   * Get current user
   */
  const fetchCurrentUser = async () => {
    if (!accessToken.value) {
      throw new Error("No access token available");
    }

    try {
      const userData = await authService.getCurrentUser(accessToken.value);
      user.value = userData;

      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }

      return userData;
    } catch (err) {
      clearAuth();
      throw err;
    }
  };

  /**
   * Handle OAuth login
   */
  const loginWithOAuth = async (provider: string, code: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.oauthCallback(provider, code);
      saveAuth(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return response.user;
    } catch (err: any) {
      error.value = err.message || "OAuth login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user: computed(() => user.value),
    accessToken: computed(() => accessToken.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Methods
    initAuth,
    login,
    register,
    logout,
    refresh,
    fetchCurrentUser,
    loginWithOAuth,
    clearError: () => {
      error.value = null;
    },
  };
};
