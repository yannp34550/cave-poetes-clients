exports.handler = async (event) => {
  try {
    // Netlify reçoit le JSON via POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed (use POST)',
      };
    }

    const data = JSON.parse(event.body || '{}');

    const client = data.client || {};
    const bouteilles = data.bouteilles || { enCave: [], retirees: [] };
    const totaux = data.totaux || { nbBouteilles: 0, valeurEnCave: 0 };

    const enCave = Array.isArray(bouteilles.enCave) ? bouteilles.enCave : [];
    const retirees = Array.isArray(bouteilles.retirees) ? bouteilles.retirees : [];

    const safe = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));

    const fmtDate = (iso) => {
      if (!iso) return '';
      // iso peut être "2025-12-21T..." ou "2025-12-23"
      return safe(String(iso).slice(0, 10));
    };

    const fmtMoney = (n) => {
      const x = Number(n || 0);
      return x.toFixed(2);
    };

    const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>La cave de ${safe(client.prenom || '')}</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;background:#f6f6f6;margin:0;padding:24px}
    h1{margin:0 0 16px}
    h2{margin:18px 0 10px;font-size:16px;color:#333}
    .card{background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,0,0,.06)}
    .name{font-weight:600;font-size:16px}
    .price{font-weight:700;margin-top:4px}
    .meta{color:#666;font-size:13px;margin-top:6px;line-height:1.35}
    .retired{opacity:.65;text-decoration:line-through}
    .total{margin-top:22px;font-weight:700}
  </style>
</head>
<body>
  <h1>🍷 La cave de ${safe(client.prenom || client.nom || 'Client')}</h1>

  <h2>En cave</h2>
  ${enCave.map(b => `
    <div class="card">
      <div class="name">${safe(b.nom)}</div>
      <div class="price">${fmtMoney(b.prix)} €</div>
      <div class="meta">Attribuée le ${fmtDate(b.dateAttribution)}</div>
    </div>
  `).join('') || '<div class="card"><div class="meta">Aucune bouteille en cave.</div></div>'}

  ${retirees.length ? `
    <h2>Retirées</h2>
    ${retirees.map(b => `
      <div class="card retired">
        <div class="name">${safe(b.nom)}</div>
        <div class="price">${fmtMoney(b.prix)} €</div>
        <div class="meta">
          Attribuée le ${fmtDate(b.dateAttribution)}<br/>
          Retirée le ${fmtDate(b.dateRetrait?.start || b.dateRetrait)}
        </div>
      </div>
    `).join('')}
  ` : ''}

  <div class="total">
    Total en cave : ${Number(totaux.nbBouteilles || 0)} bouteille(s) — ${fmtMoney(totaux.valeurEnCave)} €
  </div>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: html,
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
