// Vercel Serverless Function — Debug (CommonJS)
// GET /api/debug

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "AIzaSyDmYk9RUBjrCQe1vv9g69k87P51Ke_CZHY";

  return res.status(200).json({
    hasKey: key.length > 0,
    keyStart: key.length > 0 ? key.slice(0, 10) : "NONE",
    envKeys: Object.keys(process.env).filter(k => k.includes("GEMINI") || k.includes("OPENAI")),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    moduleType: "CommonJS",
  });
};
