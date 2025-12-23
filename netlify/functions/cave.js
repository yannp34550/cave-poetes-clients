exports.handler = async (event) => {
  /* =========================
     1. Méthode HTTP
  ========================== */

  const method = event.httpMethod;

  if (method !== "GET" && method !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed (use GET or POST)",
    };
  }

  /* =========================
     2. Récupération des données
     - POST : body JSON (n8n)
     - GET  : query params (test navigateur)
  ========================== */

  let payload;

  try {
    if (method === "POST") {
      payload =
        typeof event.body === "string"
          ? JSON.parse(event.body)
          : event.body;
    } else {
      // GET → test simple
      payload = {
        clientId: event.queryStringParameters?.clientId || "test",
        client: {
          prenom: "Test",
        },
        bouteilles: {
          enCave: [],
          retirees: [],
        },
        totaux: {
          nbBouteilles: 0,
          valeurEnCave: 0,
        },
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: "JSON invalide",
    };
  }

  /* =========================
     3. Validation minimale
  ========================== */

  if (!payload.clientId) {
    return {
      statusCode: 400,
      body: "clientId manquant",
    };
  }

  /* =========================
     4. Données utiles
  ========================== */

  const prenom = payload.client?.prenom || "Client";
  const bouteilles = payload.bouteilles?.enCave || [];

  /* =========================
     5. Génération HTML
  ========================== */

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>La cave de ${prenom}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      background: #f6f6f6;
      margin: 0;
      padding: 16px;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 16px;
    }
    .card {
      background: white;
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,.05);
    }
    .price {
      font-weight: bold;
      margin-top: 4px;
    }
    .date {
      font-size: 13px;
      color: #666;
    }
  </style>
</head>
<body>

  <h1>🍷 La cave de ${prenom}</h1>

  ${
    bouteilles.length === 0
      ? `<p>Aucune bouteille en cave pour le moment.</p>`
      : bouteilles
          .map(
            (b) => `
    <div class="card">
      <div>${b.nom}</div>
      <div class="price">${Number(b.prix).toFixed(2)} €</div>
      <div class="date">Attribuée le ${b.dateAttribution}</div>
    </div>
  `
          )
          .join("")
  }

</body>
</html>
`;

  /* =========================
     6. Réponse
  ========================== */

  return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    clientId,
    html,
  }),
};

