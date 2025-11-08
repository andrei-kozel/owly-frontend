# Twitch OAuth Integration

## Overview

This application supports OAuth authentication with Twitch, allowing users to login with their Twitch account.

## Setup Instructions

### 1. Create a Twitch Application

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Click "Register Your Application"
3. Fill in the application details:
   - **Name**: Your app name (e.g., "Owly")
   - **OAuth Redirect URLs**: Add your callback URLs
     - Development: `http://localhost:3000/auth/callback/twitch`
     - Production: `https://yourdomain.com/auth/callback/twitch`
   - **Category**: Choose appropriate category
4. Click "Create"
5. Copy your **Client ID**

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_TWITCH_CLIENT_ID=your-twitch-client-id-here
VITE_TWITCH_REDIRECT_URI=http://localhost:3000/auth/callback/twitch
```

### 3. OAuth Flow

The OAuth flow works as follows:

1. User clicks "Login with Twitch" button
2. User is redirected to Twitch authorization page
3. User approves the application
4. Twitch redirects back to `/auth/callback/twitch` with authorization code
5. Frontend exchanges code for tokens via backend (simulated)
6. User is authenticated and redirected to `/app`

## Files Structure

```
app/
├── config/
│   └── oauth.ts                    # OAuth configuration & helpers
├── services/
│   └── auth.service.ts             # OAuth callback handler
├── composables/
│   └── useAuth.ts                  # OAuth login method
├── pages/
│   └── auth/
│       └── callback/
│           └── twitch.vue          # OAuth callback page
└── components/
    └── dialogs/
        └── LoginDialog.vue         # Login UI with Twitch button
```

## Security Features

### CSRF Protection

- Random state parameter generated and stored in sessionStorage
- State verified on callback to prevent CSRF attacks

### Token Security

- Authorization code exchange happens server-side (recommended)
- Access tokens stored in localStorage (client-only)
- Refresh tokens for token renewal
- Automatic cleanup on logout

## Backend Integration

For production, implement the token exchange on your backend:

```typescript
// Backend endpoint: POST /api/auth/oauth/callback
export async function oauthCallback(provider: string, code: string) {
  // Exchange code with Twitch
  const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TWITCH_REDIRECT_URI,
    }),
  });

  const tokens = await tokenResponse.json();

  // Get user info from Twitch
  const userResponse = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID,
    },
  });

  const userData = await userResponse.json();

  // Create or update user in your database
  const user = await createOrUpdateUser(userData);

  // Generate your own JWT tokens
  const accessToken = generateJWT(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}
```

## Testing

### Test the OAuth Flow

1. Start the development server: `npm run dev`
2. Click "Login" in the header
3. Click "Login with Twitch"
4. You'll be redirected to Twitch (simulated in dev)
5. Approve the application
6. You'll be redirected back and logged in

### Demo Mode

Currently, the app uses a simulated OAuth flow for development:

- No actual Twitch API calls are made
- Mock user data is returned
- Perfect for testing the UI flow

## Twitch API Scopes

Current scopes requested:

- `user:read:email` - Read user email address

Add more scopes in `app/config/oauth.ts` if needed:

```typescript
scope: [
  "user:read:email",
  "user:read:subscriptions",
  // Add more scopes as needed
],
```

## Production Checklist

- [ ] Set up Twitch application in production mode
- [ ] Add production redirect URL to Twitch app
- [ ] Implement backend token exchange
- [ ] Store Twitch client secret securely (backend only)
- [ ] Enable HTTPS
- [ ] Test OAuth flow end-to-end
- [ ] Monitor OAuth error rates
- [ ] Set up token refresh logic
- [ ] Implement proper error handling
- [ ] Add rate limiting

## Troubleshooting

### "Invalid redirect URI"

- Ensure the redirect URI in your Twitch app matches exactly
- Check for trailing slashes
- Verify protocol (http vs https)

### "Invalid state parameter"

- Clear your browser's sessionStorage
- Ensure cookies/localStorage are enabled
- Check for browser privacy settings blocking storage

### Token expired

- Implement token refresh logic
- Check token expiration times
- Verify server/client time synchronization

## Resources

- [Twitch Authentication Docs](https://dev.twitch.tv/docs/authentication)
- [Twitch API Reference](https://dev.twitch.tv/docs/api)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
