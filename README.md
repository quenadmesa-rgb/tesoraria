# Tesouraria — Juventude da Autonomia da Cidade das Águias de Pemba

Sistema de tesouraria da Direcção da Juventude (Assembleia de Deus Africana — Avante na Fé): membros, cotas, classificação, contribuições, conferências, actividades, ofertas, saídas, jovens e liderança, Região de Pemba, gráficos, Excel e relatórios mensais e anuais em Word e PDF.

## Como funciona

- **Com MySQL (recomendado):** um pequeno servidor Node.js guarda tudo numa base de dados MySQL. Todos os aparelhos vêem os mesmos dados e cada alteração fica gravada na base de dados.
- **Sem servidor:** se o site for aberto sem a API (por exemplo, só como página estática), os dados ficam guardados só no navegador de cada aparelho.

## Arrancar com MySQL no computador

1. Instale o [Node.js](https://nodejs.org) (versão 20 ou mais recente) e tenha o MySQL a correr.
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` (utilizador, senha, porta e nome da base de dados) e `AUTH_SECRET`.
3. Faça duplo clique em **`iniciar.bat`** (ou corra `npm install` e depois `npm start`).
4. Abra `http://localhost:3000`. Noutros aparelhos da mesma rede Wi-Fi, use o endereço que aparece na janela do servidor.

A base de dados e as tabelas são criadas sozinhas no primeiro arranque (ver `sql/schema.sql`).

## Tabelas

| Tabela | Conteúdo |
|---|---|
| `membros` | registo dos membros e as suas cotas |
| `movimentos` | ofertas, saídas e contribuições |
| `eventos` | conferências, retiros e campanhas |
| `actividades` | actividades realizadas |
| `regiao`, `config`, `relatorios` | Região de Pemba, liderança e textos dos relatórios |
| `utilizadores` | contas de acesso |
| `acessos` | registo de cada entrada no sistema |

## Excel

Em cada secção há **Exportar Excel** e, para quem pode editar, **Importar Excel** e **Modelo** (um ficheiro com as colunas certas). Em **Relatórios e dados** há um Excel com todos os dados.

## Instalar no telemóvel

Abra o endereço no Chrome (Android) ou Safari (iPhone) e escolha **Adicionar ao ecrã principal**.

## Segurança

- Senhas fortes obrigatórias e guardadas cifradas (PBKDF2). Na primeira entrada, cada pessoa tem de definir a sua própria senha.
- Permissões por papel: administrador, tesoureiro e só leitura, verificadas no servidor.
- Nunca envie o ficheiro `.env` nem cópias de dados (`.json`, `.xlsx`) para este repositório.
