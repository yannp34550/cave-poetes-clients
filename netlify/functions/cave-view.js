import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const clientId = context.params.clientId;

  if (!clientId) {
    return new Response("ClientId manquant", { status: 400 });
  }

  const store = getStore("caves-html");
  const filename = `caves/${clientId}.html`;

  const html = await store.get(filename, { type: "text" });

  if (!html) {
    return new Response("Cave introuvable", { status: 404 });
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
