import { getStore } from '@netlify/blobs';

export async function handler(event) {
  try {
    // 🔎 clientId depuis l'URL /cave/:clientId
    const clientId = event.pathParameters?.clientId;

    if (!clientId) {
      return {
        statusCode: 400,
        body: 'ClientId manquant',
      };
    }

    const store = getStore('caves-html');
    const filename = `caves/${clientId}.html`;

    const html = await store.get(filename, { type: 'text' });

    if (!html) {
      return {
        statusCode: 404,
        body: 'Cave introuvable',
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: html,
    };
  } catch (err) {
    console.error('cave-view error:', err);
    return {
      statusCode: 500,
      body: 'Erreur serveur',
    };
  }
}
