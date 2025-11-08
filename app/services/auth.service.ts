import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "~/types/auth";

// Simulated backend delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database (in real app, this would be backend)
const mockUsers = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password123", // In real app, this would be hashed
    name: "Demo User",
    role: "user",
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
];

// Generate mock tokens (in real app, these would be JWT from backend)
const generateToken = () => {
  return btoa(
    JSON.stringify({
      exp: Date.now() + 3600000, // 1 hour
      iat: Date.now(),
      random: Math.random(),
    })
  );
};

export const authService = {
  /**
   * Simulate login request
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800); // Simulate network delay

    const user = mockUsers.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: generateToken(),
      refreshToken: generateToken(),
    };
  },

  /**
   * Simulate register request
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(800);

    // Check if user already exists
    if (mockUsers.find((u) => u.email === data.email)) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email: data.email,
      password: data.password,
      name: data.name,
      role: "user",
    };

    mockUsers.push(newUser);

    const { password, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      accessToken: generateToken(),
      refreshToken: generateToken(),
    };
  },

  /**
   * Simulate logout request
   */
  async logout(): Promise<void> {
    await delay(300);
    // In real app, invalidate token on backend
  },

  /**
   * Simulate token refresh
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    await delay(500);

    try {
      const decoded = JSON.parse(atob(refreshToken));
      if (decoded.exp < Date.now()) {
        throw new Error("Refresh token expired");
      }

      return {
        accessToken: generateToken(),
      };
    } catch {
      throw new Error("Invalid refresh token");
    }
  },

  /**
   * Simulate get current user
   */
  async getCurrentUser(token: string): Promise<User> {
    await delay(300);

    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        throw new Error("Token expired");
      }

      // In real app, decode JWT and fetch user from backend
      return mockUsers[0] as User;
    } catch {
      throw new Error("Invalid token");
    }
  },

  /**
   * Simulate OAuth callback - exchange code for tokens
   */
  async oauthCallback(provider: string, code: string): Promise<AuthResponse> {
    await delay(1000);

    // In real app, send code to backend which exchanges it with OAuth provider
    // Backend validates and returns user data + tokens

    // Simulate Twitch user
    const twitchUser = {
      id: "twitch-" + Math.random().toString(36).substring(7),
      email: "user@twitch.tv",
      name: "Twitch User",
      role: "user",
      provider: "twitch",
    };

    return {
      user: twitchUser,
      accessToken: generateToken(),
      refreshToken: generateToken(),
    };
  },
};
