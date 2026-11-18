// Núcleo da API: ligação ao MySQL, criação das tabelas, senhas e sessões.
// Configuração (variáveis de ambiente):
//   DATABASE_URL  mysql://utilizador:senha@servidor:porta/base   (obrigatória)
//   DB_SSL        "false" para MySQL local sem SSL (na nuvem deixe vazio)
//   AUTH_SECRET   texto longo e aleatório para assinar as sessões (obrigatória)
import mysql from "mysql2/promise";
import crypto from "node:crypto";

export const COLECOES = ["membros", "eventos", "movimentos", "actividades", "regiao", "config", "relatorios"];
export const PAPEIS = ["admin", "tesoureiro", "leitor", "responsavel", "viceResponsavel", "secretario", "viceSecretario", "conselheiro", "pastor"];
export const PODE_GRAVAR = ["admin", "tesoureiro"];
// Quem vê a lista de utilizadores: administrador e secretários (os outros só o próprio perfil)
export const VER_UTILIZADORES = ["admin", "secretario", "viceSecretario"];
// Privilégios extra que o administrador pode atribuir a cada pessoa, além do papel
export const PRIVILEGIOS = ["gravar", "verUtilizadores"];
export function privDe(u) { let p = u && u.privilegios; if (typeof p === "string") { try { p = JSON.parse(p); } catch { p = null; } } const o = {}; for (const k of PRIVILEGIOS) if (p && p[k] === true) o[k] = true; return o; }
export const podeGravar = u => !!u && (PODE_GRAVAR.includes(u.papel) || !!privDe(u).gravar);
export const podeVerUtilizadores = u => !!u && (VER_UTILIZADORES.includes(u.papel) || !!privDe(u).verUtilizadores);
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
    try { await db.query("ALTER TABLE utilizadores ADD COLUMN privilegios VARCHAR(255) NULL"); } catch (e) { if (e.code !== "ER_DUP_FIELDNAME") throw e; }
    // ---- Modelo relacional normalizado (1FN–3FN): uma tabela por entidade, chaves primárias e estrangeiras,
    //      sem valores repetidos nem dependências transitivas. Preenchido a partir dos documentos e actualizado a cada gravação.
    for (const v of ["jovens", "ofertas", "saidas", "contribuicoes", "contribuicoes_entradas", "conferencias"]) {
      const [[t]] = await db.query("SELECT TABLE_TYPE t FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?", [v]);
      if (t && t.t === "VIEW") await db.query(`DROP VIEW \`${v}\``);
    }
    await db.query("SET FOREIGN_KEY_CHECKS=0");
    for (const t of [...TABELAS_NORMAIS].reverse()) await db.query(`DROP TABLE IF EXISTS \`${t}\``);
    await db.query("SET FOREIGN_KEY_CHECKS=1");
    for (const sql of ESQUEMA_NORMAL) await db.query(sql);
    await db.query("INSERT INTO cargos (id,nome,ordem) VALUES ?", [CARGOS_JOVENS.map(([k, l], i) => [k, l, i + 1])]);
    await db.query("INSERT INTO cargos_lideranca (id,nome,ordem) VALUES ?", [Object.entries(CARGOS_LID).map(([k, l], i) => [k, l, i + 1])]);
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

// ---- Modelo normalizado (3FN). Cada entidade tem a sua tabela; os nomes vivem só na tabela "dona" (sem repetição).
const CARGOS_LID = { responsavel: "Responsável", viceResponsavel: "Vice-Responsável", secretario: "Secretário(a)", viceSecretario: "Vice-Secretário(a)", coord1: "Membro Coordenador 1", coord2: "Membro Coordenador 2", coord3: "Membro Coordenador 3", cons1: "Família Conselheira", pastor: "Pastor da autonomia" };
const CARGOS_JOVENS = [["responsavel", "Responsável"], ["viceResponsavel", "Vice-Responsável"], ["secretario", "Secretário(a)"], ["viceSecretario", "Vice-Secretário(a)"], ["coordenador", "Membro Coordenador"], ["blocoResponsavel", "Responsável do Bloco"], ["blocoViceResponsavel", "Vice-Responsável do Bloco"], ["blocoSecretario", "Secretário(a) do Bloco"], ["blocoViceSecretario", "Vice-Secretário(a) do Bloco"], ["blocoCoordenador", "Membro Coordenador do Bloco"], ["conselheiro", "Conselheiro(a)"], ["coordenadorGeral", "Coordenador(a)"], ["pastor", "Pastor(a)"], ["diacono", "Diácono(isa)"]];
const TABELAS_NORMAIS = ["cargos", "jovens", "cotas", "ofertas", "contribuicoes", "contribuicoes_entradas", "conferencias", "conferencias_entradas", "saidas", "actividades_realizadas", "cargos_lideranca", "lideranca", "regiao_direccoes", "regiao_quotas", "regiao_conferencias", "regiao_conferencias_metas"];
const D = "DEFAULT CHARSET=utf8mb4";
const ESQUEMA_NORMAL = [
  `CREATE TABLE cargos (id VARCHAR(40) PRIMARY KEY, nome VARCHAR(80) NOT NULL, ordem INT) ${D}`,
  `CREATE TABLE jovens (id VARCHAR(64) PRIMARY KEY, nome VARCHAR(200) NOT NULL, sexo ENUM('M','F','PAI','MAE') NULL, cargo_id VARCHAR(40) NULL, cargo_outro VARCHAR(120) NULL, local ENUM('Sede','Bindura') NOT NULL DEFAULT 'Sede', activo_bindura BOOLEAN NOT NULL DEFAULT 0, conta_como_jovem BOOLEAN NOT NULL DEFAULT 1, telefone VARCHAR(40) NULL, nascimento DATE NULL, membro_desde DATE NULL, morada VARCHAR(200) NULL, notas TEXT NULL, ordem INT NULL,
    FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE SET NULL, INDEX idx_jovens_nome (nome)) ${D}`,
  `CREATE TABLE cotas (jovem_id VARCHAR(64) NOT NULL, ano SMALLINT NOT NULL, mes TINYINT NOT NULL, valor DECIMAL(14,2) NOT NULL, PRIMARY KEY (jovem_id,ano,mes), FOREIGN KEY (jovem_id) REFERENCES jovens(id) ON DELETE CASCADE, CHECK (mes BETWEEN 1 AND 12)) ${D}`,
  `CREATE TABLE ofertas (id VARCHAR(64) PRIMARY KEY, data DATE NULL, descricao VARCHAR(200) NULL, nota VARCHAR(500) NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, INDEX idx_ofertas_data (data)) ${D}`,
  `CREATE TABLE contribuicoes (id VARCHAR(64) PRIMARY KEY, nome VARCHAR(200) NOT NULL, data DATE NULL, meta DECIMAL(14,2) NULL, recebido_manual DECIMAL(14,2) NULL, saidas_manual DECIMAL(14,2) NULL, nota VARCHAR(500) NULL) ${D}`,
  `CREATE TABLE contribuicoes_entradas (id VARCHAR(64) PRIMARY KEY, contribuicao_id VARCHAR(64) NOT NULL, nome VARCHAR(200) NULL, data DATE NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, nota VARCHAR(500) NULL, FOREIGN KEY (contribuicao_id) REFERENCES contribuicoes(id) ON DELETE CASCADE) ${D}`,
  `CREATE TABLE conferencias (id VARCHAR(64) PRIMARY KEY, nome VARCHAR(200) NOT NULL, tipo VARCHAR(30) NULL, data DATE NULL, meta DECIMAL(14,2) NULL, recebido_manual DECIMAL(14,2) NULL, saidas_manual DECIMAL(14,2) NULL, origem_do_valor VARCHAR(500) NULL) ${D}`,
  `CREATE TABLE conferencias_entradas (id VARCHAR(64) PRIMARY KEY, conferencia_id VARCHAR(64) NOT NULL, nome VARCHAR(200) NULL, data DATE NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, nota VARCHAR(500) NULL, FOREIGN KEY (conferencia_id) REFERENCES conferencias(id) ON DELETE CASCADE) ${D}`,
  `CREATE TABLE saidas (id VARCHAR(64) PRIMARY KEY, data DATE NULL, descricao VARCHAR(200) NULL, origem ENUM('cota','oferta','evento') NOT NULL DEFAULT 'cota', contribuicao_id VARCHAR(64) NULL, conferencia_id VARCHAR(64) NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, nota VARCHAR(500) NULL,
    FOREIGN KEY (contribuicao_id) REFERENCES contribuicoes(id) ON DELETE SET NULL, FOREIGN KEY (conferencia_id) REFERENCES conferencias(id) ON DELETE SET NULL, INDEX idx_saidas_data (data)) ${D}`,
  `CREATE TABLE actividades_realizadas (id VARCHAR(64) PRIMARY KEY, data DATE NULL, periodo VARCHAR(100) NULL, nome VARCHAR(200) NOT NULL, tipo VARCHAR(30) NULL, local VARCHAR(120) NULL, participantes INT NULL, observacao TEXT NULL) ${D}`,
  `CREATE TABLE cargos_lideranca (id VARCHAR(40) PRIMARY KEY, nome VARCHAR(80) NOT NULL, ordem INT) ${D}`,
  `CREATE TABLE lideranca (cargo_id VARCHAR(40) PRIMARY KEY, nome VARCHAR(200) NOT NULL, FOREIGN KEY (cargo_id) REFERENCES cargos_lideranca(id) ON DELETE CASCADE) ${D}`,
  `CREATE TABLE regiao_direccoes (id VARCHAR(64) PRIMARY KEY, nome VARCHAR(200) NOT NULL, ordem INT NULL) ${D}`,
  `CREATE TABLE regiao_quotas (direccao_id VARCHAR(64) NOT NULL, ano SMALLINT NOT NULL, mes TINYINT NOT NULL, valor DECIMAL(14,2) NOT NULL, PRIMARY KEY (direccao_id,ano,mes), FOREIGN KEY (direccao_id) REFERENCES regiao_direccoes(id) ON DELETE CASCADE) ${D}`,
  `CREATE TABLE regiao_conferencias (id VARCHAR(64) PRIMARY KEY, nome VARCHAR(200) NOT NULL, ano SMALLINT NULL) ${D}`,
  `CREATE TABLE regiao_conferencias_metas (conferencia_id VARCHAR(64) NOT NULL, direccao_id VARCHAR(64) NOT NULL, meta DECIMAL(14,2) NULL, valor DECIMAL(14,2) NULL, PRIMARY KEY (conferencia_id,direccao_id),
    FOREIGN KEY (conferencia_id) REFERENCES regiao_conferencias(id) ON DELETE CASCADE, FOREIGN KEY (direccao_id) REFERENCES regiao_direccoes(id) ON DELETE CASCADE) ${D}`,
];
const numOk = v => { if (v === "" || v == null) return null; const n = typeof v === "number" ? v : parseFloat(String(v).replace(/\s/g, "").replace(",", ".")); return isFinite(n) ? n : null; };
const dataOk = v => { const s = String(v || ""); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null; };
const txt = (v, n = 200) => { const s = String(v ?? "").trim(); return s ? s.slice(0, n) : null; };
async function existe(cx, tabela, id) { if (!id) return false; const [r] = await cx.query(`SELECT 1 FROM \`${tabela}\` WHERE id=?`, [id]); return r.length > 0; }
async function tipoEvento(cx, id) { if (!id) return null; const [r] = await cx.query("SELECT JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo')) t FROM eventos WHERE id=?", [id]); return r[0] ? r[0].t : null; }
// Actualiza as tabelas normalizadas para um documento gravado (dados=null quando apagado). Nunca impede a gravação principal.
export async function espelhar(cx, col, id, dados) {
  try { await espelharDoc(cx, col, id, dados); } catch (e) { console.error("Espelho (" + col + "/" + id + "):", e.code || e.message); }
}
async function espelharDoc(cx, col, id, d) {
  if (col === "membros") {
    if (!d) { await cx.query("DELETE FROM jovens WHERE id=?", [id]); return; }
    const cargo = CARGOS_JOVENS.some(c => c[0] === d.cargo) ? d.cargo : null, cargoOutro = !cargo && d.cargo ? String(d.cargo).slice(0, 120) : null, sexo = ["M", "F", "PAI", "MAE"].includes(d.sexo) ? d.sexo : null;
    await cx.query(`INSERT INTO jovens (id,nome,sexo,cargo_id,cargo_outro,local,activo_bindura,conta_como_jovem,telefone,nascimento,membro_desde,morada,notas,ordem) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE nome=VALUES(nome),sexo=VALUES(sexo),cargo_id=VALUES(cargo_id),cargo_outro=VALUES(cargo_outro),local=VALUES(local),activo_bindura=VALUES(activo_bindura),conta_como_jovem=VALUES(conta_como_jovem),telefone=VALUES(telefone),nascimento=VALUES(nascimento),membro_desde=VALUES(membro_desde),morada=VALUES(morada),notas=VALUES(notas),ordem=VALUES(ordem)`,
      [id, txt(d.nome) || "(sem nome)", sexo, cargo, cargoOutro, d.bindura ? "Bindura" : "Sede", d.bindura && d.activo ? 1 : 0, d.naoJovem ? 0 : 1, txt(d.telefone, 40), dataOk(d.nascimento), dataOk(d.entrada), txt(d.morada), txt(d.notas, 5000), numOk(d.ordem)]);
    await cx.query("DELETE FROM cotas WHERE jovem_id=?", [id]);
    const rows = [];
    for (const [ano, meses] of Object.entries(d.cotas || {})) for (const [mes, v] of Object.entries(meses || {})) { const n = numOk(v); if (n != null && +ano && +mes >= 1 && +mes <= 12) rows.push([id, +ano, +mes, n]); }
    if (rows.length) await cx.query("INSERT INTO cotas (jovem_id,ano,mes,valor) VALUES ?", [rows]);
  } else if (col === "eventos") {
    await cx.query("DELETE FROM contribuicoes WHERE id=?", [id]); // ON DELETE CASCADE / SET NULL tratam das entradas e saídas
    if (!d) { await cx.query("DELETE FROM conferencias WHERE id=?", [id]); return; }
    if (d.tipo === "contribuicao") {
      await cx.query("DELETE FROM conferencias WHERE id=?", [id]);
      await cx.query("INSERT INTO contribuicoes (id,nome,data,meta,recebido_manual,saidas_manual,nota) VALUES (?,?,?,?,?,?,?)", [id, txt(d.nome) || "(sem nome)", dataOk(d.data), numOk(d.meta), numOk(d.entradasManual), numOk(d.saidasManual), txt(d.nota, 500)]);
    } else {
      await cx.query(`INSERT INTO conferencias (id,nome,tipo,data,meta,recebido_manual,saidas_manual,origem_do_valor) VALUES (?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE nome=VALUES(nome),tipo=VALUES(tipo),data=VALUES(data),meta=VALUES(meta),recebido_manual=VALUES(recebido_manual),saidas_manual=VALUES(saidas_manual),origem_do_valor=VALUES(origem_do_valor)`,
        [id, txt(d.nome) || "(sem nome)", txt(d.tipo, 30), dataOk(d.data), numOk(d.meta), numOk(d.entradasManual), numOk(d.saidasManual), txt(d.nota, 500)]);
    }
    // re-liga movimentos deste evento (se o evento mudou de tipo ou foi recriado)
    const [mv] = await cx.query("SELECT id,dados FROM movimentos WHERE JSON_UNQUOTE(JSON_EXTRACT(dados,'$.eventoId'))=?", [id]);
    for (const m of mv) await espelharDoc(cx, "movimentos", m.id, typeof m.dados === "string" ? JSON.parse(m.dados) : m.dados);
  } else if (col === "movimentos") {
    for (const t of ["ofertas", "saidas", "contribuicoes_entradas", "conferencias_entradas"]) await cx.query(`DELETE FROM \`${t}\` WHERE id=?`, [id]);
    if (!d) return;
    const data = dataOk(d.data), valor = numOk(d.valor) || 0;
    if (d.tipo === "oferta") await cx.query("INSERT INTO ofertas (id,data,descricao,nota,valor) VALUES (?,?,?,?,?)", [id, data, txt(d.nome), txt(d.nota, 500), valor]);
    else if (d.tipo === "saida") {
      const te = await tipoEvento(cx, d.eventoId), ctr = te === "contribuicao" && await existe(cx, "contribuicoes", d.eventoId) ? d.eventoId : null, cnf = te && te !== "contribuicao" && await existe(cx, "conferencias", d.eventoId) ? d.eventoId : null;
      const origem = (ctr || cnf) ? "evento" : d.origem === "oferta" ? "oferta" : "cota";
      await cx.query("INSERT INTO saidas (id,data,descricao,origem,contribuicao_id,conferencia_id,valor,nota) VALUES (?,?,?,?,?,?,?,?)", [id, data, txt(d.nome), origem, ctr, cnf, valor, txt(d.nota, 500)]);
    } else if (d.tipo === "contribuicao") {
      const te = await tipoEvento(cx, d.eventoId);
      if (te === "contribuicao" && await existe(cx, "contribuicoes", d.eventoId)) await cx.query("INSERT INTO contribuicoes_entradas (id,contribuicao_id,nome,data,valor,nota) VALUES (?,?,?,?,?,?)", [id, d.eventoId, txt(d.nome), data, valor, txt(d.nota, 500)]);
      else if (te && await existe(cx, "conferencias", d.eventoId)) await cx.query("INSERT INTO conferencias_entradas (id,conferencia_id,nome,data,valor,nota) VALUES (?,?,?,?,?,?)", [id, d.eventoId, txt(d.nome), data, valor, txt(d.nota, 500)]);
    }
  } else if (col === "actividades") {
    await cx.query("DELETE FROM actividades_realizadas WHERE id=?", [id]);
    if (d) await cx.query("INSERT INTO actividades_realizadas (id,data,periodo,nome,tipo,local,participantes,observacao) VALUES (?,?,?,?,?,?,?,?)", [id, dataOk(d.data), txt(d.periodo, 100), txt(d.nome) || "(sem nome)", txt(d.tipo, 30), txt(d.local, 120), numOk(d.participantes), txt(d.nota, 5000)]);
  } else if (col === "config" && id === "lideranca") {
    await cx.query("DELETE FROM lideranca");
    const rows = Object.entries(d || {}).filter(([k, v]) => CARGOS_LID[k] && String(v || "").trim()).map(([k, v]) => [k, String(v).trim().slice(0, 200)]);
    if (rows.length) await cx.query("INSERT INTO lideranca (cargo_id,nome) VALUES ?", [rows]);
  } else if (col === "regiao" && id === "pemba") {
    await cx.query("DELETE FROM regiao_conferencias"); await cx.query("DELETE FROM regiao_direccoes"); // as quotas e metas apagam-se em cascata
    if (!d) return;
    const dirs = (d.direcoes || []).filter(x => x && !x.removida && x.id), ids = new Set(dirs.map(x => x.id));
    if (dirs.length) await cx.query("INSERT INTO regiao_direccoes (id,nome,ordem) VALUES ?", [dirs.map(x => [x.id, txt(x.nome) || "(sem nome)", numOk(x.ordem)])]);
    const q = [];
    for (const [ano, porDir] of Object.entries(d.quotas || {})) for (const [dir, meses] of Object.entries(porDir || {})) if (ids.has(dir)) for (const [mes, v] of Object.entries(meses || {})) { const n = numOk(v); if (n != null && +mes >= 1 && +mes <= 12) q.push([dir, +ano, +mes, n]); }
    if (q.length) await cx.query("INSERT INTO regiao_quotas (direccao_id,ano,mes,valor) VALUES ?", [q]);
    const confs = Object.entries(d.conferencias || {}).filter(([, c]) => c && !c.removida);
    if (confs.length) await cx.query("INSERT INTO regiao_conferencias (id,nome,ano) VALUES ?", [confs.map(([cid, c]) => [cid, txt(c.nome) || "(sem nome)", numOk(c.ano)])]);
    const mt = [];
    for (const [cid, c] of confs) for (const [dir, x] of Object.entries(c.dados || {})) if (ids.has(dir)) mt.push([cid, dir, numOk(x?.meta), numOk(x?.valor)]);
    if (mt.length) await cx.query("INSERT INTO regiao_conferencias_metas (conferencia_id,direccao_id,meta,valor) VALUES ?", [mt]);
  }
}
async function espelharTudo(db) {
  const ler = async (t, w = "") => { const [r] = await db.query(`SELECT id,dados FROM \`${t}\` ${w}`); return r.map(x => [x.id, typeof x.dados === "string" ? JSON.parse(x.dados) : x.dados]); };
  // ordem das dependências: entidades "pai" antes das "filhas"
  for (const [id, d] of await ler("membros")) await espelhar(db, "membros", id, d);
  for (const [id, d] of await ler("eventos")) await espelharDoc(db, "eventos", id, d).catch(e => console.error("Espelho eventos:", e.code || e.message));
  for (const [id, d] of await ler("movimentos")) await espelhar(db, "movimentos", id, d);
  for (const [id, d] of await ler("actividades")) await espelhar(db, "actividades", id, d);
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
  const [rows] = await getPool().query("SELECT id,nome,papel,privilegios,senha_alterada,hash,sessao_id FROM utilizadores WHERE id=?", [d.u]);
  const u = rows[0];
  if (!u || String(u.hash).slice(0, 12) !== d.pv) return null;
  if (!u.sessao_id || u.sessao_id !== d.sid) return null; // a conta entrou noutro aparelho ou saiu
  delete u.hash;
  return u;
}

export function utilizadorPublico(r) {
  return { id: r.id, nome: r.nome, papel: r.papel, privilegios: privDe(r), senhaAlterada: !!r.senha_alterada, ultimoLogin: r.ultimo_login || null, totalLogins: r.total_logins || 0, criado: r.criado_em || null };
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
