import { getStore } from "@netlify/blobs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;

  try {
    payload = typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;
  } catch (e) {
    return { statusCode: 400, body: "JSON invalide" };
  }

  const { clientId, html } = payload;

  if (!clientId || !html) {
    return {
      statusCode: 400,
      body: "clientId ou html manquant",
    };
  }

  const store = getStore("caves");
  const filename = `${clientId}.html`;

  await store.set(filename, html, {
    contentType: "text/html; charset=utf-8",
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      url: `/caves/${filename}`,
    }),
  };
}
