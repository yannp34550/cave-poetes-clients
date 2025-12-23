import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    // 1️⃣ Récupération du clientId depuis l'URL
    const clientId =
      event.pathParameters?.clientId ||
      event.queryStringParameters?.clientId;

    if (!clientId) {
      return {
        statusCode: 400,
        body: "ClientId manquant",
      };
    }

    // 2️⃣ Lecture depuis les blobs
    const store = getStore("caves-html");
    const filename = `caves/${clientId}.html`;

    const html = await store.get(filename, { type: "text" });

    if (!html) {
      return {
        statusCode: 404,
        body: "Cave introuvable",
      };
    }

    // 3️⃣ Retour HTML
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
      body: html,
    };
  } catch (err) {
    console.error("cave-view error:", err);
    return {
      statusCode: 500,
      body: "Erreur lecture cave",
    };
  }
};
