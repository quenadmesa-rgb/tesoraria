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
    // "sessao_id": a única sessão válida desta conta (a mesma conta não pode estar ligada duas vezes).
    try { await db.query("ALTER TABLE utilizadores ADD COLUMN sessao_id VARCHAR(32) NULL"); } catch (e) { if (e.code !== "ER_DUP_FIELDNAME") throw e; }
    // ---- Tabelas "espelho" (actualizadas a cada gravação) para consultar no MySQL sem ler JSON
    await db.query(`CREATE TABLE IF NOT EXISTS cotas (membro_id VARCHAR(64) NOT NULL, membro VARCHAR(200), ano SMALLINT NOT NULL, mes TINYINT NOT NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, PRIMARY KEY (membro_id,ano,mes), INDEX idx_cotas_ano (ano,mes)) DEFAULT CHARSET=utf8mb4`);
    await db.query(`CREATE TABLE IF NOT EXISTS lideranca (cargo VARCHAR(40) NOT NULL PRIMARY KEY, cargo_nome VARCHAR(80), nome VARCHAR(200)) DEFAULT CHARSET=utf8mb4`);
    await db.query(`CREATE TABLE IF NOT EXISTS regiao_direccoes (id VARCHAR(64) NOT NULL PRIMARY KEY, nome VARCHAR(200), ordem INT) DEFAULT CHARSET=utf8mb4`);
    await db.query(`CREATE TABLE IF NOT EXISTS regiao_quotas (direccao_id VARCHAR(64) NOT NULL, direccao VARCHAR(200), ano SMALLINT NOT NULL, mes TINYINT NOT NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, PRIMARY KEY (direccao_id,ano,mes)) DEFAULT CHARSET=utf8mb4`);
    await db.query(`CREATE TABLE IF NOT EXISTS regiao_conferencias (id VARCHAR(64) NOT NULL, direccao_id VARCHAR(64) NOT NULL, conferencia VARCHAR(200), ano SMALLINT, direccao VARCHAR(200), meta DECIMAL(14,2) NULL, valor DECIMAL(14,2) NULL, PRIMARY KEY (id,direccao_id)) DEFAULT CHARSET=utf8mb4`);
    // ---- Vistas legíveis (aparecem como tabelas no MySQL)
    const J = (p, t = "VARCHAR(200)") => `CAST(JSON_UNQUOTE(JSON_EXTRACT(dados,'$.${p}')) AS CHAR(200))`;
    const N = p => `CAST(IF(JSON_TYPE(JSON_EXTRACT(dados,'$.${p}')) IN ('INTEGER','DOUBLE','DECIMAL'),JSON_EXTRACT(dados,'$.${p}'),NULL) AS DECIMAL(14,2))`;
    const vistas = {
      jovens: `SELECT id, ${J("nome")} AS nome, ${J("cargo")} AS cargo, ${J("sexo")} AS sexo, IF(JSON_EXTRACT(dados,'$.bindura')=true,'Bindura','Sede') AS local, IF(JSON_EXTRACT(dados,'$.activo')=true,'Sim','Não') AS activo_bindura, IF(JSON_EXTRACT(dados,'$.naoJovem')=true,'Não','Sim') AS conta_como_jovem, ${J("telefone")} AS telefone, ${J("nascimento")} AS nascimento, ${J("entrada")} AS membro_desde, ${J("morada")} AS morada FROM membros`,
      ofertas: `SELECT id, ${J("data")} AS data, ${J("nome")} AS descricao, ${J("nota")} AS nota, ${N("valor")} AS valor FROM movimentos WHERE JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))='oferta'`,
      saidas: `SELECT id, ${J("data")} AS data, ${J("nome")} AS descricao, ${J("origem")} AS origem, ${J("eventoId")} AS evento_id, ${N("valor")} AS valor, ${J("nota")} AS nota FROM movimentos WHERE JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))='saida'`,
      contribuicoes_entradas: `SELECT id, ${J("eventoId")} AS contribuicao_id, ${J("nome")} AS nome, ${N("valor")} AS valor, ${J("data")} AS data FROM movimentos WHERE JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))='contribuicao'`,
      contribuicoes: `SELECT id, ${J("nome")} AS contribuicao, ${J("data")} AS data, ${N("meta")} AS meta, ${N("entradasManual")} AS recebido_manual, ${N("saidasManual")} AS saidas_manual FROM eventos WHERE JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))='contribuicao'`,
      conferencias: `SELECT id, ${J("nome")} AS conferencia, ${J("tipo")} AS tipo, ${J("data")} AS data, ${N("meta")} AS meta, ${N("entradasManual")} AS recebido_manual, ${N("saidasManual")} AS saidas_manual, ${J("nota")} AS origem_do_valor FROM eventos WHERE JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))<>'contribuicao'`,
    };
    for (const [v, sql] of Object.entries(vistas)) await db.query(`CREATE OR REPLACE VIEW \`${v}\` AS ${sql}`);
    await espelharTudo(db);
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

// ---- Espelho: reescreve as tabelas cotas / lideranca / regiao_* a partir dos documentos JSON
const CARGOS_LID = { responsavel: "Responsável", viceResponsavel: "Vice-Responsável", secretario: "Secretário(a)", viceSecretario: "Vice-Secretário(a)", coord1: "Membro Coordenador 1", coord2: "Membro Coordenador 2", coord3: "Membro Coordenador 3", cons1: "Família Conselheira", pastor: "Pastor da autonomia" };
const numOk = v => { const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/\s/g, "").replace(",", ".")); return isFinite(n) ? n : null; };
export async function espelhar(cx, col, id, dados) {
  if (col === "membros") {
    await cx.query("DELETE FROM cotas WHERE membro_id=?", [id]);
    if (!dados) return;
    const rows = [];
    for (const [ano, meses] of Object.entries(dados.cotas || {})) for (const [mes, v] of Object.entries(meses || {})) { const n = numOk(v); if (n != null && +ano && +mes) rows.push([id, String(dados.nome || "").slice(0, 200), +ano, +mes, n]); }
    if (rows.length) await cx.query("INSERT INTO cotas (membro_id,membro,ano,mes,valor) VALUES ?", [rows]);
  } else if (col === "config" && id === "lideranca") {
    await cx.query("DELETE FROM lideranca");
    const rows = Object.entries(dados || {}).filter(([k]) => CARGOS_LID[k]).map(([k, v]) => [k, CARGOS_LID[k], String(v || "").slice(0, 200)]);
    if (rows.length) await cx.query("INSERT INTO lideranca (cargo,cargo_nome,nome) VALUES ?", [rows]);
  } else if (col === "regiao" && id === "pemba") {
    await cx.query("DELETE FROM regiao_direccoes"); await cx.query("DELETE FROM regiao_quotas"); await cx.query("DELETE FROM regiao_conferencias");
    if (!dados) return;
    const dirs = (dados.direcoes || []).filter(d => d && !d.removida), nomes = Object.fromEntries(dirs.map(d => [d.id, d.nome]));
    if (dirs.length) await cx.query("INSERT INTO regiao_direccoes (id,nome,ordem) VALUES ?", [dirs.map(d => [d.id, String(d.nome || "").slice(0, 200), +d.ordem || 0])]);
    const q = [];
    for (const [ano, porDir] of Object.entries(dados.quotas || {})) for (const [dir, meses] of Object.entries(porDir || {})) if (nomes[dir] != null) for (const [mes, v] of Object.entries(meses || {})) { const n = numOk(v); if (n != null) q.push([dir, nomes[dir], +ano, +mes, n]); }
    if (q.length) await cx.query("INSERT INTO regiao_quotas (direccao_id,direccao,ano,mes,valor) VALUES ?", [q]);
    const c = [];
    for (const [cid, conf] of Object.entries(dados.conferencias || {})) if (conf && !conf.removida) for (const [dir, x] of Object.entries(conf.dados || {})) if (nomes[dir] != null) c.push([cid, dir, String(conf.nome || "").slice(0, 200), +conf.ano || null, nomes[dir], numOk(x?.meta), numOk(x?.valor)]);
    if (c.length) await cx.query("INSERT INTO regiao_conferencias (id,direccao_id,conferencia,ano,direccao,meta,valor) VALUES ?", [c]);
  }
}
async function espelharTudo(db) {
  const ler = async (t, w = "") => { const [r] = await db.query(`SELECT id,dados FROM \`${t}\` ${w}`); return r.map(x => [x.id, typeof x.dados === "string" ? JSON.parse(x.dados) : x.dados]); };
  await db.query("DELETE FROM cotas");
  for (const [id, d] of await ler("membros")) await espelhar(db, "membros", id, d);
  const lid = await ler("config", "WHERE id='lideranca'"); await espelhar(db, "config", "lideranca", lid[0]?.[1] || null);
  const reg = await ler("regiao", "WHERE id='pemba'"); await espelhar(db, "regiao", "pemba", reg[0]?.[1] || null);
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
  const p = b64(JSON.stringify({ u: u.id, pv: String(u.hash).slice(0, 12), sid: u.sessao_id || null, exp: Date.now() + 30 * 864e5 }));
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
  const [rows] = await getPool().query("SELECT id,nome,papel,senha_alterada,hash,sessao_id FROM utilizadores WHERE id=?", [d.u]);
  const u = rows[0];
  if (!u || String(u.hash).slice(0, 12) !== d.pv) return null;
  if (!u.sessao_id || u.sessao_id !== d.sid) return null; // a conta entrou noutro aparelho ou saiu
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

// MySQL desligado ou inacessível: a app continua com os dados do aparelho e envia tudo quando voltar.
const CODIGOS_SEM_DB = ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EHOSTUNREACH", "ENOTFOUND", "PROTOCOL_CONNECTION_LOST", "ER_CON_COUNT_ERROR", "ER_SERVER_SHUTDOWN", "ER_ACCESS_DENIED_ERROR", "ER_BAD_DB_ERROR"];
export function semBaseDados(e) { return !!e && (CODIGOS_SEM_DB.includes(e.code) || (e.fatal && !e.status)); }
export function erroInterno(res, e) {
  if (semBaseDados(e)) { console.error("MySQL indisponível:", e.code); return enviar(res, 503, { erro: "A base de dados está desligada.", codigo: "db_offline" }); }
  console.error(e);
  enviar(res, e.status || 500, { erro: e.status ? e.message : "Erro no servidor da base de dados." });
}
