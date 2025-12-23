import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    const { filename, html } = JSON.parse(event.body || "{}");

    if (!filename || !html) {
      return {
        statusCode: 400,
        body: "Missing filename or html",
      };
    }

    // Dossier cible : /caves
    const outputDir = path.join(process.cwd(), "caves");
    const filePath = path.join(outputDir, filename);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(filePath, html, "utf8");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        url: `/caves/${filename}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
}
