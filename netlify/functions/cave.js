// ⚠️ stockage temporaire en mémoire (OK pour POC)
let STORE = {};

exports.handler = async (event) => {
  // =========================
  // POST → n8n envoie les données
  // =========================
  if (event.httpMethod === "POST") {
    try {
      const payload = JSON.parse(event.body);

      if (!payload.clientId) {
        return { statusCode: 400, body: "clientId manquant" };
      }

      // On stocke les données par clientId
      STORE[payload.clientId] = payload;

      return {
        statusCode: 200,
        body: "OK",
      };
    } catch (err) {
      return {
        statusCode: 400,
        body: "JSON invalide",
      };
    }
  }

  // =========================
  // GET → affichage HTML
  // =========================
  if (event.httpMethod === "GET") {
    const clientId = event.queryStringParameters?.clientId;

    if (!clientId) {
      return { statusCode: 400, body: "clientId manquant" };
    }

    const data = STORE[clientId];

    if (!data) {
      return {
        statusCode: 404,
        body: "Aucune donnée pour ce client",
      };
    }

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Ma cave – ${data.client.prenom}</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
body{font-family:system-ui;background:#f6f6f6;margin:0;padding:16px}
h1{font-size:22px;margin-bottom:16px}
.card{background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 4px 10px rgba(0,0,0,.05)}
.price{font-weight:700}
.badge{font-size:12px;color:#666}
</style>
</head>
<body>

<h1>🍷 La cave de ${data.client.prenom}</h1>

${data.bouteilles.enCave.map(b => `
  <div class="card">
    <div>${b.nom}</div>
    <div class="price">${b.prix.toFixed(2)} €</div>
    <div class="badge">Attribuée le ${b.dateAttribution}</div>
  </div>
`).join("")}

${data.bouteilles.retirees.length ? `
<h2>🍾 Bouteilles retirées</h2>
${data.bouteilles.retirees.map(b => `
  <div class="card">
    <div>${b.nom}</div>
    <div class="badge">Retirée le ${b.dateRetrait?.start}</div>
  </div>
`).join("")}
` : ""}

</body>
</html>`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: html,
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
