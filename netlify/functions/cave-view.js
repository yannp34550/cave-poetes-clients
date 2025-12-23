import { getStore } from '@netlify/blobs';

export default async (req) => {
  try {
    // URL actuelle : https://domaine.netlify.app/cave/xxxx
    const url = new URL(req.url);

    // On récupère le dernier segment de l’URL
    const segments = url.pathname.split('/');
    const clientId = segments.pop();

    if (!clientId) {
      return new Response('ClientId manquant', { status: 400 });
    }

    const store = getStore('caves-html');
    const filename = `caves/${clientId}.html`;

    // Lecture du fichier HTML dans le Blob store
    const html = await store.get(filename, { type: 'text' });

    if (!html) {
      return new Response('Cave introuvable', { status: 404 });
    }

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (err) {
    console.error('cave-view error:', err);
    return new Response('Erreur serveur', { status: 500 });
  }
};
