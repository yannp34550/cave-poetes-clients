import { getStore } from "@netlify/blobs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  /* =========================
     NORMALISATION DU PAYLOAD
     (n8n-proof, définitif)
  ========================== */

  let payload = null;

  try {
    // 1. event.body est TOUJOURS une string sur Netlify
    const parsed = JSON.parse(event.body);

    // 2. n8n encapsule parfois le vrai JSON dans parsed.body
    if (typeof parsed.body === "string") {
      payload = JSON.parse(parsed.body);
    } else {
      payload = parsed;
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: "JSON invalide (parse impossible)",
    };
  }

  /* =========================
     EXTRACTION ROBUSTE
  ========================== */

  const clientId =
    payload.clientId ||
    payload.clientid ||
    payload.client_id ||
    null;

  const html = payload.html || null;

  if (!clientId || !html) {
    return {
      statusCode: 400,
      body: "clientId ou html manquant",
    };
  }

  /* =========================
     SAUVEGARDE NETLIFY BLOBS
  ========================== */

  try {
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
        clientId,
        url: `/caves/${filename}`,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Erreur sauvegarde HTML",
    };
  }
}
