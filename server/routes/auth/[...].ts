import {
  defineEventHandler,
  setResponseStatus,
  setResponseHeader,
  appendResponseHeader,
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

    const response = await fetch(target, {
      headers: headers,
      method: event.method,
      redirect: "manual",
    });

    setResponseStatus(event, response.status);

    response.headers.forEach((value, key) => {
      if (key === "content-encoding" || key === "content-length") return;

      if (key === "set-cookie") {
        appendResponseHeader(event, key, value);
      } else {
        setResponseHeader(event, key, value);
      }
    });

    if (typeof response.headers.getSetCookie === "function") {
      const cookies = response.headers.getSetCookie();
      if (cookies && cookies.length > 0) {
        setResponseHeader(event, "set-cookie", cookies);
      }
    }

    const body = await response.text();

    return body;
  } catch (error) {
    console.error("[Proxy] Error:", error);
    setResponseStatus(event, 500);
    return "Proxy Error: " + error;
  }
});
