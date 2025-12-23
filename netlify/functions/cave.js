exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method !== "GET" && method !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed (use GET or POST)" };
  }

  let payload;

  try {
    if (method === "POST") {
      payload = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } else {
      // GET = test navigateur
      payload = {
        clientId: event.queryStringParameters?.clientId || "test",
        client: { prenom: "Test" },
        bouteilles: { enCave: [], retirees: [] },
        totaux: { nbBouteilles: 0, valeurEnCave: 0 },
      };
    }
  } catch (e) {
    return { statusCode: 400, body: "JSON invalide" };
  }

  const clientId = payload?.clientId;
  if (!clientId) return { statusCode: 400, body: "clientId manquant" };

  const prenom = payload?.client?.prenom || "Client";
  const bouteilles = payload?.bouteilles?.enCave || [];

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>La cave de ${prenom}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui,-apple-system,BlinkMacSystemFont; background:#f6f6f6; margin:0; padding:16px; }
    h1 { font-size:22px; margin-bottom:16px; }
    .card { background:#fff; border-radius:14px; padding:14px; margin-bottom:12px; box-shadow:0 4px 10px rgba(0,0,0,.05); }
    .price { font-weight:700; margin-top:4px; }
    .date { font-size:13px; color:#666; }
  </style>
</head>
<body>
  <h1>🍷 La cave de ${prenom}</h1>
  ${
    bouteilles.length === 0
      ? `<p>Aucune bouteille en cave pour le moment.</p>`
      : bouteilles.map((b) => `
        <div class="card">
          <div>${b.nom || "Bouteille"}</div>
          <div class="price">${Number(b.prix || 0).toFixed(2)} €</div>
          <div class="date">Attribuée le ${b.dateAttribution || ""}</div>
        </div>
      `).join("")
  }
</body>
</html>`;

  // GET = HTML direct
  if (method === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: html,
    };
  }

  // POST = JSON pour n8n (indispensable pour l’étape save-html)
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ clientId, html }),
  };
};
