import { defineEventHandler, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  // Skip if it's the login initiation route which is handled by [provider].get.ts
  // But [provider].get.ts only handles /auth/:provider
  // This catch-all handles /auth/me, /auth/logout, /auth/:provider/callback

  const apiUrl = process.env.API_URL || "http://localhost:3030";
  // event.path includes the full path e.g. /auth/twitch/callback
  const target = `${apiUrl}${event.path}`;

  return proxyRequest(event, target, {
    fetchOptions: {
      redirect: "manual", // Important: pass redirects back to the browser
    },
  });
});
