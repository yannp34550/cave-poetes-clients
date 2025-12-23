// netlify/functions/cave.js

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};

  const clientSlug = params.client || null;
  const clientIdParam = params.clientId || null;

  /**
   * 🔹 TABLE DE RÉSOLUTION (TEMPORAIRE)
   * ➜ Plus tard : remplacée par appel n8n / Notion
   */
  const CLIENTS = {
    "yann-pereira": {
      id: "2ccbfc76-bafa-80fc-81b8-caba00e0c9c3",
      prenom: "Yann",
      nom: "PEREIRA",
    },
    "erick-menivale": {
      id: "2d1bfc76-bafa-80a7-93de-c42d2991ff67",
      prenom: "Erick",
      nom: "MENIVALE",
    },
  };

  let clientMeta = null;

  // 1️⃣ Résolution par slug (prioritaire)
  if (clientSlug && CLIENTS[clientSlug]) {
    clientMeta = CLIENTS[clientSlug];
  }

  // 2️⃣ Fallback par clientId (ancien fonctionnement)
  if (!clientMeta && clientIdParam) {
    clientMeta = Object.values(CLIENTS).find(
      (c) => c.id === clientIdParam
    );
  }

  if (!clientMeta) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Client introuvable",
    };
  }

  /**
   * 🔹 DONNÉES SIMULÉES (inchangées)
   * ➜ Elles viendront de n8n ensuite
   */
  const data = {
    client: {
      prenom: clientMeta.prenom,
      nom: clientMeta.nom,
    },
    bouteilles: {
      enCave: [
        {
          nom: "DOMAINE DE CEBENE LES BANCELS 75CL RG",
          prix: 18.9,
          dateAttribution: "2025-12-21",
        },
        {
          nom: "LA RECTORIE COTE MER RG 75CL",
          prix: 20.6,
          dateAttribution: "2025-12-21",
        },
      ],
      retirees: [
        {
          nom: "LA VOULTE GASPARETS ROMAIN PAUC RG 75CL",
          prix: 25.5,
          dateAttribution: "2025-12-21",
          dateRetrait: "2025-12-23",
        },
      ],
    },
  };

  /**
   * 🔹 HTML FINAL
   */
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>La cave de ${data.client.prenom}</title>
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
    .retiree {
      opacity: 0.6;
    }
  </style>
</head>
<body>

  <h1>🍷 La cave de ${data.client.prenom}</h1>

  ${data.bouteilles.enCave
    .map(
      (b) => `
    <div class="card">
      <div>${b.nom}</div>
      <div class="price">${b.prix.toFixed(2)} €</div>
      <div class="date">Attribuée le ${b.dateAttribution}</div>
    </div>
  `
    )
    .join("")}

  ${
    data.bouteilles.retirees.length
      ? `<h2>🍾 Bouteilles retirées</h2>`
      : ""
  }

  ${data.bouteilles.retirees
    .map(
      (b) => `
    <div class="card retiree">
      <div>${b.nom}</div>
      <div class="price">${b.prix.toFixed(2)} €</div>
      <div class="date">Retirée le ${b.dateRetrait}</div>
    </div>
  `
    )
    .join("")}

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
};
