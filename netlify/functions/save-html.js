const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;

  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "JSON invalide" };
  }

  const clientId = payload.clientId;
  const html = payload.html;

  if (!clientId || !html) {
    return {
      statusCode: 400,
      body: "clientId ou html manquant",
    };
  }

  try {
    const store = getStore("caves");

    await store.set(`${clientId}.html`, html, {
      contentType: "text/html; charset=utf-8",
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        clientId,
        file: `${clientId}.html`,
      }),
    };
  } catch (err) {
    console.error("BLOBS ERROR", err);

    return {
      statusCode: 500,
      body: "Erreur sauvegarde HTML",
    };
  }
};
