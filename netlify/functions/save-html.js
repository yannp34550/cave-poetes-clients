import { getStore } from '@netlify/blobs';

export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const body = await req.json();
    const { clientId, html } = body;

    if (!clientId || !html) {
      return new Response(
        JSON.stringify({ error: 'clientId ou html manquant' }),
        { status: 400 }
      );
    }

    const store = getStore('caves-html');
    const filename = `caves/${clientId}.html`;

    await store.set(filename, html, {
      contentType: 'text/html',
    });

    // ✅ URL dynamique du site Netlify
    const baseUrl =
      process.env.URL || process.env.DEPLOY_PRIME_URL;

    const publicUrl = `${baseUrl}/.netlify/blobs/caves-html/${filename}`;

    return new Response(
      JSON.stringify({
        success: true,
        clientId,
        url: publicUrl,
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
      { status: 500 }
    );
  }
};
