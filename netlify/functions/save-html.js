import { getStore } from "@netlify/blobs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed (use POST)",
    };
  }

  let payload;

  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: "JSON invalide",
    };
  }

  const { clientId, html } = payload;

  if (!clientId || !html) {
    return {
      statusCode: 400,
      body: "clientId ou html manquant",
    };
  }

  const store = getStore("caves-html");

  await store.set(`${clientId}.html`, html, {
    contentType: "text/html",
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      url: `/caves/${clientId}.html`,
    }),
  };
}
