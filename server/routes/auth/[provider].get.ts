import { defineEventHandler, sendRedirect, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, "provider");
  const config = useRuntimeConfig();

  // Only handle known providers for login initiation
  if (!["twitch", "youtube", "kick"].includes(provider)) {
    return;
  }

  const apiUrl = process.env.API_URL || "http://localhost:3030";
  const targetUrl = `${apiUrl}/auth/${provider}`;

  try {
    // Fetch with manual redirect to get the Location header
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "manual",
    });

    const location = response.headers.get("location");
    if (location) {
      return sendRedirect(event, location, 302);
    }

    // If no redirect, maybe proxy the content?
    // But for login, we expect a redirect.
    throw new Error("No redirect location received from backend");
  } catch (error) {
    console.error(`Failed to initiate auth for ${provider}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: "Authentication initiation failed",
    });
  }
});
