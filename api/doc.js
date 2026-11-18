// POST /api/doc  {ops:[{op,col,id,data}]}  -> grava uma ou várias alterações numa transacção.
//   op: "set" (substitui), "update" (junta campos), "delete", "senha" (a própria senha: {atual,nova}),
//       "importar" (só administrador: copia uma cópia de segurança completa para o MySQL).
// Permissões: "leitor" só lê; "tesoureiro" grava tudo menos utilizadores; "admin" grava tudo.
import { COLECOES, PAPEIS, PODE_GRAVAR, getPool, ensureSchema, sessao, novaSenha, confereSenha, exigeSenhaForte, criarToken, merge, enviar, lerCorpo, erroInterno, dbConfigurada, espelhar } from "./_lib/core.js";

const idOk = id => typeof id === "string" && /^[A-Za-z0-9._-]{1,64}$/.test(id);
const proibido = m => Object.assign(new Error(m), { status: 403 });
const invalido = m => Object.assign(new Error(m), { status: 400 });

async function gravarDoc(cx, eu, { op, col, id, data }) {
  if (!COLECOES.includes(col)) throw invalido("Colecção desconhecida: " + col);
  if (!idOk(id)) throw invalido("Identificador inválido.");
  if (op === "delete") { await cx.query(`DELETE FROM \`${col}\` WHERE id=?`, [id]); await espelhar(cx, col, id, null); return; }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw invalido("Dados inválidos.");
  let novo = data;
  if (op === "update") {
    const [r] = await cx.query(`SELECT dados FROM \`${col}\` WHERE id=? FOR UPDATE`, [id]);
    if (!r.length) throw Object.assign(new Error("O registo já não existe."), { status: 404 });
    const velho = typeof r[0].dados === "string" ? JSON.parse(r[0].dados) : r[0].dados;
    novo = merge(velho, data);
  } else if (op !== "set") throw invalido("Operação desconhecida.");
  await cx.query(`INSERT INTO \`${col}\` (id,dados,actualizado_por) VALUES (?,?,?) ON DUPLICATE KEY UPDATE dados=VALUES(dados), actualizado_por=VALUES(actualizado_por)`, [id, JSON.stringify(novo), eu.id]);
  await espelhar(cx, col, id, novo); // tabelas cotas / lideranca / regiao_* sempre actualizadas
}

async function gravarUtilizador(cx, eu, { op, id, data }) {
  if (eu.papel !== "admin") throw proibido("Só o administrador pode gerir utilizadores.");
  if (!idOk(id)) throw invalido("Utilizador inválido.");
  const [admins] = await cx.query("SELECT id FROM utilizadores WHERE papel='admin' FOR UPDATE");
  const [cur] = await cx.query("SELECT * FROM utilizadores WHERE id=? FOR UPDATE", [id]);
  const u = cur[0];
  if (op === "delete") {
    if (id === eu.id) throw invalido("Não pode apagar o seu próprio utilizador.");
    if (u && u.papel === "admin" && admins.length < 2) throw invalido("Tem de ficar pelo menos um administrador.");
    await cx.query("DELETE FROM utilizadores WHERE id=?", [id]); return;
  }
  data = data || {};
  const papel = data.papel != null ? String(data.papel) : (u ? u.papel : "leitor");
  if (!PAPEIS.includes(papel)) throw invalido("Papel inválido.");
  if (u && u.papel === "admin" && papel !== "admin" && admins.length < 2) throw invalido("Tem de ficar pelo menos um administrador.");
  if (id === eu.id && papel !== eu.papel) throw invalido("Não pode mudar o seu próprio papel.");
  const nome = String(data.nome ?? u?.nome ?? id).trim().slice(0, 200) || id;
  const senha = data.senha != null ? String(data.senha) : "";
  if (senha) exigeSenhaForte(senha, id);
  if (!u) {
    if (op === "update") throw Object.assign(new Error("O utilizador já não existe."), { status: 404 });
    if (!senha) throw invalido("Escreva a senha.");
    const s = novaSenha(senha);
    await cx.query("INSERT INTO utilizadores (id,nome,papel,salt,hash,alg,senha_alterada) VALUES (?,?,?,?,?,?,0)", [id, nome, papel, s.salt, s.hash, s.alg]); // tem de mudar a senha na primeira entrada
    return;
  }
  if (senha) { const s = novaSenha(senha); await cx.query("UPDATE utilizadores SET nome=?,papel=?,salt=?,hash=?,alg=?,senha_alterada=0 WHERE id=?", [nome, papel, s.salt, s.hash, s.alg, id]); } // senha reposta: tem de a mudar ao entrar
  else await cx.query("UPDATE utilizadores SET nome=?,papel=? WHERE id=?", [nome, papel, id]);
}

async function mudarSenha(cx, eu, { data }) {
  const atual = String(data?.atual || ""), nova = String(data?.nova || "");
  const [[u]] = await cx.query("SELECT * FROM utilizadores WHERE id=? FOR UPDATE", [eu.id]);
  if (!confereSenha(atual, u)) throw invalido("A senha actual está errada.");
  if (nova === atual) throw invalido("A nova senha tem de ser diferente da actual.");
  exigeSenhaForte(nova, eu.id);
  const s = novaSenha(nova);
  await cx.query("UPDATE utilizadores SET salt=?,hash=?,alg=?,senha_alterada=1 WHERE id=?", [s.salt, s.hash, s.alg, eu.id]);
  return criarToken({ id: eu.id, hash: s.hash, sessao_id: eu.sessao_id }); // a sessão deste aparelho continua
}

async function importar(cx, eu, { data }) {
  if (eu.papel !== "admin") throw proibido("Só o administrador pode importar cópias.");
  if (!data || typeof data !== "object") throw invalido("Cópia inválida.");
  for (const c of COLECOES) {
    const docs = data[c];
    if (!docs || typeof docs !== "object") continue;
    for (const [id, v] of Object.entries(docs)) if (idOk(id) && v && typeof v === "object") await gravarDoc(cx, eu, { op: "set", col: c, id, data: v });
  }
  // Utilizadores da cópia: só entram os que ainda não existem (as senhas já vêm cifradas em PBKDF2).
  for (const [id, v] of Object.entries(data.utilizadores || {})) {
    if (!idOk(id) || !v || !v.salt || !v.hash || !PAPEIS.includes(v.papel || "leitor")) continue;
    await cx.query("INSERT IGNORE INTO utilizadores (id,nome,papel,salt,hash,alg,senha_alterada) VALUES (?,?,?,?,?,?,?)", [id, String(v.nome || id).slice(0, 200), v.papel || "leitor", v.salt, v.hash, v.alg || "sha256", v.senhaAlterada ? 1 : 0]);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return enviar(res, 405, { erro: "Método não permitido" });
  if (!dbConfigurada()) return enviar(res, 503, { erro: "Base de dados não configurada." });
  let cx;
  try {
    await ensureSchema();
    const eu = await sessao(req);
    if (!eu) return enviar(res, 401, { erro: "Sessão terminada. Entre outra vez." });
    const b = await lerCorpo(req);
    const ops = Array.isArray(b.ops) ? b.ops : [];
    if (!ops.length || ops.length > 2000) return enviar(res, 400, { erro: "Nada para gravar." });
    // "sair": termina a presença (deixa de aparecer como ligado).
    // "sair" liberta a conta (a sessão deixa de valer); "ausente" (fechar a página) só tira a pessoa da lista de ligados.
    if (ops.length === 1 && ops[0].op === "sair") { await getPool().query("UPDATE utilizadores SET visto_em=NULL, sessao_id=NULL WHERE id=?", [eu.id]); return enviar(res, 200, { ok: true }); }
    if (ops.length === 1 && ops[0].op === "ausente") { await getPool().query("UPDATE utilizadores SET visto_em=NULL WHERE id=?", [eu.id]); return enviar(res, 200, { ok: true }); }
    const soSenha = ops.every(o => o.op === "senha");
    if (!eu.senha_alterada && !soSenha) return enviar(res, 403, { erro: "Defina uma senha nova antes de continuar.", codigo: "mudar_senha" });
    if (!PODE_GRAVAR.includes(eu.papel) && !soSenha) return enviar(res, 403, { erro: "Utilizador só de visualização." });
    cx = await getPool().getConnection();
    await cx.beginTransaction();
    let token = null;
    for (const o of ops) {
      if (o.op === "senha") token = await mudarSenha(cx, eu, o);
      else if (o.op === "importar") await importar(cx, eu, o);
      else if (o.col === "utilizadores") await gravarUtilizador(cx, eu, o);
      else await gravarDoc(cx, eu, o);
    }
    await cx.commit();
    return enviar(res, 200, token ? { ok: true, token } : { ok: true });
  } catch (e) {
    if (cx) { try { await cx.rollback(); } catch {} }
    return erroInterno(res, e);
  } finally { if (cx) cx.release(); }
}
