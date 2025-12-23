exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed (POST only)",
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "JSON invalide" };
  }

  const clientId = payload?.clientId;
  if (!clientId) {
    return { statusCode: 400, body: "clientId manquant" };
  }

  const prenom = payload?.client?.prenom || "Client";
  const bouteilles = payload?.bouteilles?.enCave || [];

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>La cave de ${prenom}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui; background:#f6f6f6; margin:0; padding:16px; }
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
      ? `<p>Aucune bouteille en cave.</p>`
      : bouteilles.map((b) => {
          const prix = Number(b.prix || 0)
            .toFixed(2)
            .replace(".", ",") + " €";

          const date = b.dateAttribution
            ? new Date(b.dateAttribution).toLocaleDateString("fr-FR")
            : "";

          return `
          <div class="card">
            <div>${b.nom || "Bouteille"}</div>
            <div class="price">${prix}</div>
            <div class="date">Attribuée le ${date}</div>
          </div>
        `;
        }).join("")
  }
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, html }),
  };
};
