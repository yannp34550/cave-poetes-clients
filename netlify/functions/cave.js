exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method !== "GET" && method !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed (use GET or POST)" };
  }

  let payload;

  try {
    if (method === "POST") {
      payload = typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;
    } else {
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

  // 🔽🔽🔽 ICI EXACTEMENT 🔽🔽🔽
  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const clientId = payload?.clientId;
  if (!clientId) return { statusCode: 400, body: "clientId manquant" };

  const prenom = payload?.client?.prenom || "Client";
  const bouteillesEnCave = payload?.bouteilles?.enCave || [];
  const bouteillesRetirees = payload?.bouteilles?.retirees || [];

  // 👇👇👇 le HTML utilise formatDate()
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>La cave de ${prenom}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui,-apple-system,BlinkMacSystemFont; background:#f6f6f6; margin:0; padding:16px; }
    h1 { font-size:22px; margin-bottom:16px; }
    h2 { font-size:18px; margin:20px 0 10px; }
    .card { background:#fff; border-radius:14px; padding:14px; margin-bottom:12px; box-shadow:0 4px 10px rgba(0,0,0,.05); }
    .price { font-weight:700; margin-top:4px; }
    .date { font-size:13px; color:#666; }
    .retiree { opacity:.6; }
  </style>
</head>
<body>

  <h1>🍷 La cave de ${prenom}</h1>

  <h2>🟢 Bouteilles en cave</h2>
  ${
    bouteillesEnCave.length === 0
      ? `<p>Aucune bouteille en cave.</p>`
      : bouteillesEnCave.map(b => `
        <div class="card">
          <div>${b.nom || "Bouteille"}</div>
          <div class="price">${Number(b.prixTtc || 0).toFixed(2)} €</div>
          <div class="date">Attribuée le ${formatDate(b.dateAttribution)}</div>
        </div>
      `).join("")
  }

  <h2>⚪ Bouteilles retirées</h2>
  ${
    bouteillesRetirees.length === 0
      ? `<p>Aucune bouteille retirée.</p>`
      : bouteillesRetirees.map(b => `
        <div class="card retiree">
          <div>${b.nom || "Bouteille"}</div>
          <div class="price">${Number(b.prixTtc || 0).toFixed(2)} €</div>
          <div class="date">
            Retirée le ${formatDate(b.dateRetrait)}
          </div>
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
