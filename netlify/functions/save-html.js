import { getStore } from '@netlify/blobs';

export default async (req) => {
  try {
    // 🔒 Méthode autorisée
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 📦 Lecture du body JSON
    const { clientId, html } = await req.json();

    if (!clientId || !html) {
      return new Response(
        JSON.stringify({ error: 'clientId ou html manquant' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 🗄️ Accès au store Blobs
    const store = getStore('caves-html');
    const key = `caves/${clientId}.html`;

    // 💾 Sauvegarde du HTML
    await store.set(key, html, {
      contentType: 'text/html; charset=utf-8',
    });

    // ✅ Réponse : on NE retourne PAS une URL de blob
    // 👉 on retourne une URL logique vers la function de lecture
    return new Response(
      JSON.stringify({
        success: true,
        clientId,
        accessUrl: `/cave/${clientId}`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('save-html error:', err);

    return new Response(
      JSON.stringify({
        error: 'Erreur sauvegarde HTML',
        details: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
