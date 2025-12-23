const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  const store = getStore("test");
  await store.set("ping.txt", "OK");

  return {
    statusCode: 200,
    body: "Blobs OK",
  };
};
