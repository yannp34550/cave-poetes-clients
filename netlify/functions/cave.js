export async function handler(event) {
  const clientId = event.queryStringParameters?.clientId;

  if (!clientId) {
    return {
      statusCode: 400,
      body: "clientId manquant",
    };
  }

  // ⚠️ TEMPORAIRE : JSON simulé
  // (on branchera n8n juste après)
  const data = {
    client: {
      nom: "PEREIRA YANN",
      prenom: "Yann",
    },
    bouteilles: {
      enCave: [
        {
          nom: "DOMAINE DE CEBENE",
          prix: 18.9,
          dateAttribution: "2025-12-21",
        },
      ],
      retirees: [],
    },
  };

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Ma cave – ${data.client.prenom}</title>
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
    }
  </style>
</head>
<body>

  <h1>🍷 La cave de ${data.client.prenom}</h1>

  ${data.bouteilles.enCave.map(b => `
    <div class="card">
      <div>${b.nom}</div>
      <div class="price">${b.prix.toFixed(2)} €</div>
      <div>Attribuée le ${b.dateAttribution}</div>
    </div>
  `).join("")}

</body>
</html>
`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: html,
  };
}
