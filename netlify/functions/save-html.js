const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  /* =========================
     1. Autoriser POST uniquement
  ========================== */
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed (use POST)",
    };
  }

  /* =========================
     2. Parsing JSON
  ========================== */
  let payload;

  try {
    payload =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;
  } catch (err) {
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

  /* =========================
     3. Sauvegarde dans Netlify Blobs
  ========================== */
  try {
    const store = getStore("caves");

    const filename = `${clientId}.html`;

    await store.set(filename, html, {
      contentType: "text/html",
    });

    const url = `https://${process.env.SITE_NAME}.netlify.app/.netlify/blobs/caves/${filename}`;

    /* =========================
       4. Réponse OK
    ========================== */
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        clientId,
        url,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: "Erreur lors de la sauvegarde HTML",
    };
  }
};
