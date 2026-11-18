// GET /api/data -> todos os dados da tesouraria (precisa de sessão).
// Os utilizadores vêm sem senhas. O administrador recebe também a lista de todos e o histórico de acessos.
import { COLECOES, podeVerUtilizadores, falhasSeguidas, estadoTentativas, getPool, ensureSchema, sessao, utilizadorPublico, enviar, erroInterno, dbConfigurada } from "./_lib/core.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return enviar(res, 405, { erro: "Método não permitido" });
  if (!dbConfigurada()) return enviar(res, 503, { erro: "Base de dados não configurada." });
  try {
    await ensureSchema();
    const eu = await sessao(req);
    if (!eu) return enviar(res, 401, { erro: "Sessão terminada. Entre outra vez." });
    if (!eu.senha_alterada) return enviar(res, 403, { erro: "Defina uma senha nova antes de continuar.", codigo: "mudar_senha" });
    const db = getPool();
    const out = {};
    for (const c of COLECOES) {
      const [rows] = await db.query(`SELECT id,dados FROM \`${c}\``);
      out[c] = {};
      for (const r of rows) out[c][r.id] = typeof r.dados === "string" ? JSON.parse(r.dados) : r.dados;
    }
    const admin = eu.papel === "admin";
    const verTodos = podeVerUtilizadores(eu); // administrador e secretários vêem todos; os outros só o próprio perfil
    const [us] = await db.query(verTodos ? "SELECT * FROM utilizadores" : "SELECT * FROM utilizadores WHERE id=?", verTodos ? [] : [eu.id]);
    out.utilizadores = {};
    for (const u of us) { const p = utilizadorPublico(u); delete p.id; if (admin) { const f = await falhasSeguidas(db, u.id); if (estadoTentativas(f.n, f.seg).bloqueado) p.bloqueado = true; } out.utilizadores[u.id] = p; } // só o administrador sabe quem está bloqueado
    if (admin) {
      const [ac] = await db.query("SELECT id,nome,papel,sucesso,data FROM acessos WHERE sucesso=1 ORDER BY id DESC LIMIT 300");
      out.acessos = ac.map(a => ({ ...a, sucesso: !!a.sucesso }));
    }
    // Presença: esta chamada conta como actividade; ligados = actividade nos últimos 70 segundos.
    await db.query("UPDATE utilizadores SET visto_em=NOW() WHERE id=?", [eu.id]);
    const [on] = await db.query("SELECT id,nome,papel,visto_em FROM utilizadores WHERE visto_em > (NOW() - INTERVAL 70 SECOND) ORDER BY nome");
    out.online = on.map(u => ({ id: u.id, nome: u.nome, papel: u.papel, visto: u.visto_em }));
    out.eu = utilizadorPublico(eu);
    return enviar(res, 200, out);
  } catch (e) { return erroInterno(res, e); }
}
