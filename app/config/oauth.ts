export interface OAuthProvider {
  name: string;
  authUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
}

export interface OAuthConfig {
  twitch: OAuthProvider;
}

// OAuth Configuration
export const oauthConfig: OAuthConfig = {
  twitch: {
    name: "Twitch",
    authUrl: "https://id.twitch.tv/oauth2/authorize",
    clientId: import.meta.env.VITE_TWITCH_CLIENT_ID || "your-twitch-client-id",
    redirectUri:
      import.meta.env.VITE_TWITCH_REDIRECT_URI ||
      "http://localhost:3000/auth/callback/twitch",
    scope: ["user:read:email"],
  },
};

export const getOAuthUrl = (provider: keyof OAuthConfig): string => {
  const config = oauthConfig[provider];

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scope.join(" "),
    state: generateState(), // CSRF protection
  });

  return `${config.authUrl}?${params.toString()}`;
};

// Generate random state for CSRF protection
const generateState = (): string => {
  const state = btoa(Math.random().toString(36).substring(2, 15) + Date.now());

  // Store state in sessionStorage for verification
  if (import.meta.client) {
    sessionStorage.setItem("oauth_state", state);
  }

  return state;
};

// Verify state matches
export const verifyState = (state: string): boolean => {
  if (!import.meta.client) return false;

  const storedState = sessionStorage.getItem("oauth_state");
  sessionStorage.removeItem("oauth_state");

  return state === storedState;
};
