exports.handler = async function (event) {
  /* --------------------------------------------------
   * 1️⃣ Autoriser GET (test navigateur)
   * -------------------------------------------------- */
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: "Function cave OK (GET)",
    };
  }

  /* --------------------------------------------------
   * 2️⃣ Autoriser uniquement POST
   * -------------------------------------------------- */
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  /* --------------------------------------------------
   * 3️⃣ Parser le JSON reçu
   * -------------------------------------------------- */
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: "JSON invalide",
    };
  }

  /* --------------------------------------------------
   * 4️⃣ Vérifications minimales
   * -------------------------------------------------- */
  if (!data.client || !data.bouteilles) {
    return {
      statusCode: 400,
      body: "Payload incomplet",
    };
  }

  const client = data.client;
  const bouteilles = data.bouteilles;
  const totaux = data.totaux || {};

  /* --------------------------------------------------
   * 5️⃣ Génération du HTML
   * -------------------------------------------------- */
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>La cave de ${client.prenom || ""}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      background: #f6f6f6;
      margin: 0;
      padding: 16px;
      color: #111;
    }

    h1 {
      font-size: 22px;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 16px;
      margin: 24px 0 8px;
      color: #555;
    }

    .card {
      background: #fff;
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,.05);
    }

    .nom {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .prix {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .meta {
      font-size: 13px;
      color: #666;
    }

    .retiree {
      opacity: 0.6;
    }

    .totaux {
      margin-top: 24px;
      font-size: 14px;
      color: #333;
    }
  </style>
</head>

<body>

  <h1>🍷 La cave de ${client.prenom || client.nom || ""}</h1>

  ${
    bouteilles.enCave && bouteilles.enCave.length > 0
      ? `
        <h2>En cave</h2>
        ${bouteilles.enCave
          .map(
            (b) => `
            <div class="card">
              <div class="nom">${b.nom}</div>
              <div class="prix">${b.prix.toFixed(2)} €</div>
              <div class="meta">Attribuée le ${formatDate(b.dateAttribution)}</div>
            </div>
          `
          )
          .join("")}
      `
      : `<p>Aucune bouteille en cave.</p>`
  }

  ${
    bouteilles.retirees && bouteilles.retirees.length > 0
      ? `
        <h2>Historique (bouteilles retirées)</h2>
        ${bouteilles.retirees
          .map(
            (b) => `
            <div class="card retiree">
              <div class="nom">${b.nom}</div>
              <div class="prix">${b.prix.toFixed(2)} €</div>
              <div class="meta">
                Attribuée le ${formatDate(b.dateAttribution)}<br/>
                Retirée le ${formatDate(b.dateRetrait?.start)}
              </div>
            </div>
          `
          )
          .join("")}
      `
      : ``
  }

  <div class="totaux">
    <strong>Total en cave :</strong>
    ${totaux.nbBouteilles || 0} bouteille(s) – ${
      totaux.valeurEnCave?.toFixed
        ? totaux.valeurEnCave.toFixed(2)
        : totaux.valeurEnCave || 0
    } €
  </div>

</body>
</html>
`;

  /* --------------------------------------------------
   * 6️⃣ Retour HTML
   * -------------------------------------------------- */
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: html,
  };
};

/* --------------------------------------------------
 * 🧰 Utilitaire date
 * -------------------------------------------------- */
function formatDate(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("fr-FR");
  } catch {
    return date;
  }
}
