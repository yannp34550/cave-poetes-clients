import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    const payload =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;

    const { clientId, html } = payload || {};

    if (!clientId || !html) {
      return {
        statusCode: 400,
        body: "clientId ou html manquant",
      };
    }

    // ⚠️ store name FIXE
    const store = getStore("caves-html");

    // ⚠️ clé SIMPLE, stable, sans slash
    const key = `${clientId}.html`;

    await store.set(key, html, {
      contentType: "text/html; charset=utf-8",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        key,
        url: `/.netlify/blobs/caves-html/${key}`,
      }),
    };
  } catch (err) {
    console.error("SAVE HTML ERROR", err);

    return {
      statusCode: 500,
      body: "Erreur sauvegarde HTML",
    };
  }
};
