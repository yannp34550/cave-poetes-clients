import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  try {
    const store = getStore('test-store');

    await store.set('hello', 'world');

    const value = await store.get('hello');

    return new Response(
      JSON.stringify({ success: true, value }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack,
      }),
      { status: 500 }
    );
  }
};
