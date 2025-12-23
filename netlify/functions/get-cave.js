import { getStore } from '@netlify/blobs';

export default async (req) => {
  const clientId = new URL(req.url).searchParams.get('clientId');

  if (!clientId) {
    return new Response('clientId manquant', { status: 400 });
  }

  const store = getStore('caves-html');
  const html = await store.get(`caves/${clientId}.html`);

  if (!html) {
    return new Response('Cave introuvable', { status: 404 });
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
