import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { clientId, html } = await req.json();

  if (!clientId || !html) {
    return new Response(
      JSON.stringify({ error: "clientId ou html manquant" }),
      { status: 400 }
    );
  }

  const store = getStore("caves-html");
  const filename = `caves/${clientId}.html`;

  await store.set(filename, html, {
    contentType: "text/html",
  });

  return new Response(
    JSON.stringify({
      success: true,
      clientId,
      accessUrl: `/cave/${clientId}`,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
