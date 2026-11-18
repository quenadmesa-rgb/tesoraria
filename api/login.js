// GET  /api/login  -> estado da API ({ok, db})
// POST /api/login  {user, senha} -> {token, user, padrao}. Cada tentativa fica registada na tabela "acessos".
import crypto from "node:crypto";
import { estadoTentativas, falhasSeguidas, dbConfigurada, getPool, ensureSchema, confereSenha, novaSenha, criarToken, utilizadorPublico, enviar, lerCorpo, ipDe, erroInterno } from "./_lib/core.js";

const normUser = u => String(u || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (!dbConfigurada()) return enviar(res, 200, { ok: true, db: false });
    try { await ensureSchema(); return enviar(res, 200, { ok: true, db: true }); }
    catch (e) { console.error("MySQL indisponível:", e.code || e.message); return enviar(res, 200, { ok: true, db: false, configurada: true, erro: "A base de dados está desligada." }); }
  }
  if (req.method !== "POST") return enviar(res, 405, { erro: "Método não permitido" });
  if (!dbConfigurada()) return enviar(res, 503, { erro: "Base de dados não configurada." });
  try {
    await ensureSchema();
    const db = getPool();
    const b = await lerCorpo(req);
    const user = normUser(b.user), senha = String(b.senha || "");
    const agente = String(req.headers["user-agent"] || "").slice(0, 255), ip = ipDe(req);
    const registar = (u, ok) => db.query("INSERT INTO acessos (utilizador,nome,papel,sucesso,ip,agente) VALUES (?,?,?,?,?,?)", [user || "?", u?.nome || null, u?.papel || null, ok ? 1 : 0, ip, agente]);
    if (!user || !senha) return enviar(res, 400, { erro: "Escreva o utilizador e a senha." });

    // Tentativas erradas: 3 → espera 1 min, 6 → 5 min, 9 → 15 min, 12 → bloqueada (só o administrador desbloqueia). 25 por endereço em 15 min.
    const fs = await falhasSeguidas(db, user), est = estadoTentativas(fs.n, fs.seg);
    if (est.bloqueado) return enviar(res, 423, { erro: "Conta bloqueada por demasiadas tentativas erradas. Peça ao administrador para a desbloquear.", codigo: "bloqueado" });
    if (est.esperar) { const m = Math.ceil(est.esperar / 60); return enviar(res, 429, { erro: `Demasiadas tentativas. Espere ${m} minuto${m > 1 ? "s" : ""} e tente outra vez.`, esperar: est.esperar }); }
    const [[fi]] = await db.query("SELECT COUNT(*) n FROM acessos WHERE ip=? AND sucesso=0 AND data > (NOW() - INTERVAL 15 MINUTE)", [ip]);
    if (fi.n >= 25) return enviar(res, 429, { erro: "Demasiadas tentativas. Espere 15 minutos." });

    const [[cnt]] = await db.query("SELECT COUNT(*) n FROM utilizadores");
    if (cnt.n === 0) {
      // Primeira entrada no sistema: cria o administrador com a senha padrão (tem de ser mudada a seguir).
      if (user !== "admin" || senha !== "admin123") { await registar(null, false); return enviar(res, 401, { erro: "Utilizador ou senha errados." }); }
      const s = novaSenha(senha);
      await db.query("INSERT INTO utilizadores (id,nome,papel,salt,hash,alg,senha_alterada) VALUES ('admin','Administrador','admin',?,?,?,0)", [s.salt, s.hash, s.alg]);
    }
    const [rows] = await db.query("SELECT * FROM utilizadores WHERE id=?", [user]);
    let u = rows[0];
    if (!confereSenha(senha, u)) { await registar(u, false); return enviar(res, 401, { erro: "Utilizador ou senha errados." }); }
    // A mesma conta não pode estar ligada duas vezes: recusa se já houver uma sessão activa (actividade no último minuto).
    const [[act]] = await db.query("SELECT (sessao_id IS NOT NULL AND visto_em > (NOW() - INTERVAL 70 SECOND)) activa FROM utilizadores WHERE id=?", [u.id]);
    if (act.activa) return enviar(res, 409, { erro: "Esta conta já está ligada noutro aparelho. Saia nesse aparelho primeiro (ou espere cerca de 1 minuto depois de o fechar).", codigo: "ja_ligado" });
    if (u.alg !== "pbkdf2") { const s = novaSenha(senha); await db.query("UPDATE utilizadores SET salt=?,hash=?,alg=? WHERE id=?", [s.salt, s.hash, s.alg, u.id]); }
    const sid = crypto.randomBytes(16).toString("hex");
    await db.query("UPDATE utilizadores SET ultimo_login=NOW(), visto_em=NOW(), sessao_id=?, total_logins=total_logins+1 WHERE id=?", [sid, u.id]);
    await registar(u, true);
    const [[nu]] = await db.query("SELECT * FROM utilizadores WHERE id=?", [u.id]);
    const padrao = !nu.senha_alterada; // tem de definir uma senha nova antes de usar o sistema
    return enviar(res, 200, { token: criarToken(nu), user: utilizadorPublico(nu), padrao });
  } catch (e) { return erroInterno(res, e); }
}
