import { getStore } from "@netlify/blobs";

export async function handler(event) {
  /* =========================
     1. Méthode HTTP
  ========================== */

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  /* =========================
     2. Lecture du body (ROBUSTE n8n)
     - n8n peut envoyer :
       - JSON normal
       - JSON encapsulé dans body (string)
  ========================== */

  let payload;

  try {
    const raw =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;

    // 🔥 CAS n8n : payload encapsulé dans raw.body
    payload = raw?.body
      ? JSON.parse(raw.body)
      : raw;

  } catch (err) {
    return {
      statusCode: 400,
      body: "JSON invalide",
    };
  }

  /* =========================
     3. Validation minimale
  ========================== */

  const { clientId, html } = payload || {};

  if (!clientId || !html) {
    return {
      statusCode: 400,
      body: "clientId ou html manquant",
    };
  }

  /* =========================
     4. Sauvegarde via Netlify Blobs
  ========================== */

  try {
    const store = getStore("caves");
    const filename = `${clientId}.html`;

    await store.set(filename, html, {
      contentType: "text/html; charset=utf-8",
    });

    /* =========================
       5. Réponse OK
    ========================== */

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: true,
        clientId,
        url: `/caves/${filename}`,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "Erreur sauvegarde HTML",
    };
  }
}
