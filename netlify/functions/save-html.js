const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
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

  // ⚠️ dossier writable Netlify
  const cavesDir = "/tmp/caves";
  const filePath = path.join(cavesDir, `${clientId}.html`);

  try {
    if (!fs.existsSync(cavesDir)) {
      fs.mkdirSync(cavesDir);
    }

    fs.writeFileSync(filePath, html, "utf8");
  } catch (e) {
    return {
      statusCode: 500,
      body: "Erreur écriture fichier",
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      path: filePath,
    }),
  };
};
