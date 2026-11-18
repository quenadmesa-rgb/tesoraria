// Núcleo da API: ligação ao MySQL, criação das tabelas, senhas e sessões.
// Configuração (variáveis de ambiente):
//   DATABASE_URL  mysql://utilizador:senha@servidor:porta/base   (obrigatória)
//   DB_SSL        "false" para MySQL local sem SSL (na nuvem deixe vazio)
//   AUTH_SECRET   texto longo e aleatório para assinar as sessões (obrigatória)
import mysql from "mysql2/promise";
import crypto from "node:crypto";

export const COLECOES = ["membros", "eventos", "movimentos", "actividades", "regiao", "config", "relatorios"];
export const PAPEIS = ["admin", "tesoureiro", "leitor"];
const ITER = 150000;

let pool = null, schemaPronto = null;

export function dbConfigurada() { return !!process.env.DATABASE_URL; }

export function getPool() {
  if (!pool) {
    const ssl = String(process.env.DB_SSL || "").toLowerCase() === "false" ? undefined : { minVersion: "TLSv1.2", rejectUnauthorized: true };
    pool = mysql.createPool({ uri: process.env.DATABASE_URL, ssl, connectionLimit: 4, waitForConnections: true, charset: "utf8mb4", supportBigNumbers: true, dateStrings: true });
  }
  return pool;
}

// Colunas extra (geradas a partir do JSON) para a base de dados ser legível e pesquisável no MySQL.
const EXTRA = {
  membros: [["nome", "VARCHAR(200)", "$.nome"], ["sexo", "VARCHAR(10)", "$.sexo"], ["cargo", "VARCHAR(40)", "$.cargo"], ["telefone", "VARCHAR(40)", "$.telefone"]],
  eventos: [["nome", "VARCHAR(200)", "$.nome"], ["tipo", "VARCHAR(30)", "$.tipo"], ["data", "VARCHAR(10)", "$.data"]],
  movimentos: [["tipo", "VARCHAR(20)", "$.tipo"], ["nome", "VARCHAR(200)", "$.nome"], ["data", "VARCHAR(10)", "$.data"], ["valor", "VARCHAR(32)", "$.valor"], ["evento_id", "VARCHAR(64)", "$.eventoId"]],
  actividades: [["nome", "VARCHAR(200)", "$.nome"], ["tipo", "VARCHAR(30)", "$.tipo"], ["data", "VARCHAR(10)", "$.data"]],
  regiao: [], config: [], relatorios: [],
};

export function ensureSchema() {
  if (!schemaPronto) schemaPronto = (async () => {
    // Cria a base de dados se ainda não existir (útil no MySQL local).
    const u = new URL(process.env.DATABASE_URL), nome = decodeURIComponent(u.pathname.slice(1));
    if (nome && /^[A-Za-z0-9_]+$/.test(nome)) {
      u.pathname = "/";
      const ssl = String(process.env.DB_SSL || "").toLowerCase() === "false" ? undefined : { minVersion: "TLSv1.2", rejectUnauthorized: true };
      try { const c = await mysql.createConnection({ uri: u.toString(), ssl }); await c.query(`CREATE DATABASE IF NOT EXISTS \`${nome}\` DEFAULT CHARACTER SET utf8mb4`); await c.end(); } catch (e) { if (e.code !== "ER_DBACCESS_DENIED_ERROR" && e.code !== "ER_SPECIFIC_ACCESS_DENIED_ERROR") throw e; }
    }
    const db = getPool();
    for (const c of COLECOES) {
      const extra = EXTRA[c].map(([n, t, p]) => `\`${n}\` ${t} AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'${p}'))) VIRTUAL`).join(",");
      await db.query(`CREATE TABLE IF NOT EXISTS \`${c}\` (
        id VARCHAR(64) NOT NULL PRIMARY KEY,
        dados JSON NOT NULL,
        ${extra ? extra + "," : ""}
        criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        actualizado_por VARCHAR(64) NULL
      ) DEFAULT CHARSET=utf8mb4`);
    }
    await db.query(`CREATE TABLE IF NOT EXISTS utilizadores (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      nome VARCHAR(200) NOT NULL,
      papel VARCHAR(20) NOT NULL DEFAULT 'leitor',
      salt VARCHAR(64) NOT NULL,
      hash VARCHAR(128) NOT NULL,
      alg VARCHAR(16) NOT NULL DEFAULT 'pbkdf2',
      senha_alterada TINYINT(1) NOT NULL DEFAULT 0,
      ultimo_login DATETIME NULL,
      total_logins INT NOT NULL DEFAULT 0,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4`);
    // "visto_em": última actividade da sessão (serve para saber quem está ligado agora).
    try { await db.query("ALTER TABLE utilizadores ADD COLUMN visto_em DATETIME NULL"); } catch (e) { if (e.code !== "ER_DUP_FIELDNAME") throw e; }
    await db.query(`CREATE TABLE IF NOT EXISTS acessos (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      utilizador VARCHAR(64) NOT NULL,
      nome VARCHAR(200) NULL,
      papel VARCHAR(20) NULL,
      sucesso TINYINT(1) NOT NULL,
      ip VARCHAR(64) NULL,
      agente VARCHAR(255) NULL,
      data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_acessos_utilizador (utilizador),
      INDEX idx_acessos_data (data)
    ) DEFAULT CHARSET=utf8mb4`);
  })().catch(e => { schemaPronto = null; throw e; });
  return schemaPronto;
}

// ---- senhas (iguais às do site: PBKDF2-SHA256, 150 000 voltas)
export function hashSenha(senha, salt, alg = "pbkdf2") {
  if (alg !== "pbkdf2") return crypto.createHash("sha256").update(salt + ":" + senha).digest("hex");
  return crypto.pbkdf2Sync(String(senha), String(salt), ITER, 32, "sha256").toString("hex");
}
export function novaSenha(senha) {
  const salt = crypto.randomBytes(12).toString("hex");
  return { salt, hash: hashSenha(senha, salt), alg: "pbkdf2" };
}
export function confereSenha(senha, u) {
  if (!u || !u.salt || !u.hash) return false;
  const h = hashSenha(senha, u.salt, u.alg || "sha256");
  const a = Buffer.from(h), b = Buffer.from(String(u.hash));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---- regras de senha forte (as mesmas do site)
const COMUNS = ["admin123", "12345678", "123456789", "password", "password1", "senha123", "qwerty123", "abc12345", "11111111", "tesouraria"];
export function problemasSenha(senha, user) {
  const s = String(senha || ""), e = [];
  if (s.length < 8) e.push("pelo menos 8 caracteres");
  if (!/[a-z]/.test(s)) e.push("uma letra minúscula");
  if (!/[A-Z]/.test(s)) e.push("uma letra maiúscula");
  if (!/\d/.test(s)) e.push("um número");
  if (!/[^A-Za-z0-9]/.test(s)) e.push("um símbolo (ex.: ! @ # ?)");
  if (s.length > 128) e.push("no máximo 128 caracteres");
  if (user && s.toLowerCase().includes(String(user).toLowerCase())) e.push("não conter o nome de utilizador");
  if (COMUNS.includes(s.toLowerCase())) e.push("não ser uma senha conhecida");
  return e;
}
export function exigeSenhaForte(senha, user) {
  const e = problemasSenha(senha, user);
  if (e.length) throw Object.assign(new Error("A senha precisa de: " + e.join(", ") + "."), { status: 400 });
}

// ---- sessões assinadas (válidas 30 dias). "pv" liga a sessão à senha: mudar a senha termina as outras sessões.
const b64 = s => Buffer.from(s).toString("base64url");
function segredo() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw Object.assign(new Error("AUTH_SECRET em falta"), { status: 500 });
  return s;
}
export function criarToken(u) {
  const p = b64(JSON.stringify({ u: u.id, pv: String(u.hash).slice(0, 12), exp: Date.now() + 30 * 864e5 }));
  return p + "." + crypto.createHmac("sha256", segredo()).update(p).digest("base64url");
}
export async function sessao(req) {
  const h = String(req.headers.authorization || "");
  const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  const [p, sig] = t.split(".");
  if (!p || !sig) return null;
  const ok = crypto.createHmac("sha256", segredo()).update(p).digest("base64url");
  if (ok.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(ok), Buffer.from(sig))) return null;
  let d; try { d = JSON.parse(Buffer.from(p, "base64url").toString()); } catch { return null; }
  if (!d || !d.u || d.exp < Date.now()) return null;
  const [rows] = await getPool().query("SELECT id,nome,papel,senha_alterada,hash FROM utilizadores WHERE id=?", [d.u]);
  const u = rows[0];
  if (!u || String(u.hash).slice(0, 12) !== d.pv) return null;
  delete u.hash;
  return u;
}

export function utilizadorPublico(r) {
  return { id: r.id, nome: r.nome, papel: r.papel, senhaAlterada: !!r.senha_alterada, ultimoLogin: r.ultimo_login || null, totalLogins: r.total_logins || 0, criado: r.criado_em || null };
}

export function enviar(res, status, obj) {
  res.statusCode = status;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

export async function lerCorpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > 8 * 1024 * 1024) throw Object.assign(new Error("Pedido demasiado grande."), { status: 413 }); chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString() || "{}"); } catch { return {}; }
}

export function ipDe(req) {
  return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim().slice(0, 64);
}

const isObj = v => v && typeof v === "object" && !Array.isArray(v);
export function merge(a, b) {
  const o = { ...(isObj(a) ? a : {}) };
  for (const k in b) o[k] = isObj(b[k]) && isObj(o[k]) ? merge(o[k], b[k]) : b[k];
  return o;
}

export function erroInterno(res, e) {
  console.error(e);
  enviar(res, e.status || 500, { erro: e.status ? e.message : "Erro no servidor da base de dados." });
}
