// Servidor local: serve o site e a API, igual ao Vercel.  Uso: npm start  (lê o ficheiro .env)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.dirname(fileURLToPath(import.meta.url));
try { process.loadEnvFile(path.join(raiz, ".env")); } catch {}
const PORT = +process.env.PORT || 3000;
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const API = new Set(["login", "data", "doc"]);
const PRIVADO = /^\/(\.env|\.git|api\/_lib|node_modules|server\.js|package|iniciar|sql\/)/;

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  const m = url.pathname.match(/^\/api\/([a-z]+)\/?$/);
  if (m && API.has(m[1])) {
    try { const mod = await import(pathToFileURL(path.join(raiz, "api", m[1] + ".js")).href); return await mod.default(req, res); }
    catch (e) { console.error(e); res.statusCode = 500; return res.end("Erro"); }
  }
  if (PRIVADO.test(url.pathname)) { res.statusCode = 404; return res.end("Não encontrado"); }
  let f = path.normalize(path.join(raiz, decodeURIComponent(url.pathname)));
  if (!f.startsWith(raiz)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.statusCode = 404; return res.end("Não encontrado"); }
  res.setHeader("Content-Type", TIPOS[path.extname(f)] || "application/octet-stream");
  if (f.endsWith("sw.js")) res.setHeader("Cache-Control", "no-cache");
  fs.createReadStream(f).pipe(res);
}).listen(PORT, async () => {
  console.log(`\nTesouraria a correr em:  http://localhost:${PORT}`);
  const os = await import("node:os");
  for (const l of Object.values(os.networkInterfaces()).flat()) if (l && l.family === "IPv4" && !l.internal) console.log(`Noutros aparelhos (mesma rede Wi-Fi):  http://${l.address}:${PORT}`);
  if (!process.env.DATABASE_URL) console.log("\nAVISO: falta o ficheiro .env com DATABASE_URL. Os dados ficam só no navegador.");
  else {
    try { const { ensureSchema } = await import("./api/_lib/core.js"); await ensureSchema(); console.log("\nBase de dados MySQL ligada. Tabelas prontas."); }
    catch (e) { console.log("\nERRO a ligar ao MySQL: " + (e.code || "") + " " + e.message + "\nVerifique a senha e a porta no ficheiro .env."); }
  }
  console.log("\nPara parar: feche esta janela ou carregue Ctrl+C.\n");
});
