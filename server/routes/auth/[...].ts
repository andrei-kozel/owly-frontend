import {
  defineEventHandler,
  setResponseStatus,
  setResponseHeader,
  getRequestHeaders,
} from "h3";

export default defineEventHandler(async (event) => {
  const apiUrl = process.env.API_URL || "http://localhost:3030";
  const target = `${apiUrl}${event.path}`;

  try {
    const headers = new Headers();
    const reqHeaders = getRequestHeaders(event);
    for (const [key, value] of Object.entries(reqHeaders)) {
      if (key === "host") continue;
      if (value) headers.append(key, value as string);
    }

    // @ts-ignore
    const response = await fetch(target, {
      headers: headers,
      method: event.method,
      redirect: "manual",
    });

    setResponseStatus(event, response.status);

    // Copy headers
    response.headers.forEach((value, key) => {
      // Skip content-encoding/length as we might change body
      if (key === "content-encoding" || key === "content-length") return;
      setResponseHeader(event, key, value);
    });

    const body = await response.text();

    return body;
  } catch (error) {
    console.error("[Proxy] Error:", error);
    setResponseStatus(event, 500);
    return "Proxy Error: " + error;
  }
});
