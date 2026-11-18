-- Base de dados da Tesouraria. A API cria estas tabelas sozinha na primeira ligação;
-- este ficheiro serve para consulta ou para criar tudo à mão no MySQL.
CREATE DATABASE IF NOT EXISTS tesouraria DEFAULT CHARACTER SET utf8mb4;
USE tesouraria;

CREATE TABLE IF NOT EXISTS membros (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  dados JSON NOT NULL,                       -- nome, sexo, cargo, telefone, nascimento, entrada, morada, notas, cotas{ano:{mes:valor}}, ...
  nome VARCHAR(200) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.nome'))) VIRTUAL,
  sexo VARCHAR(10) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.sexo'))) VIRTUAL,
  cargo VARCHAR(40) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.cargo'))) VIRTUAL,
  telefone VARCHAR(40) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.telefone'))) VIRTUAL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  actualizado_por VARCHAR(64) NULL
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS eventos (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  dados JSON NOT NULL,
  nome VARCHAR(200) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.nome'))) VIRTUAL,
  tipo VARCHAR(30) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))) VIRTUAL,
  data VARCHAR(10) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.data'))) VIRTUAL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  actualizado_por VARCHAR(64) NULL
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS movimentos (        -- ofertas, saídas e contribuições
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  dados JSON NOT NULL,
  tipo VARCHAR(20) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))) VIRTUAL,
  nome VARCHAR(200) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.nome'))) VIRTUAL,
  data VARCHAR(10) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.data'))) VIRTUAL,
  valor VARCHAR(32) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.valor'))) VIRTUAL,
  evento_id VARCHAR(64) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.eventoId'))) VIRTUAL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  actualizado_por VARCHAR(64) NULL
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS actividades (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  dados JSON NOT NULL,
  nome VARCHAR(200) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.nome'))) VIRTUAL,
  tipo VARCHAR(30) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.tipo'))) VIRTUAL,
  data VARCHAR(10) AS (JSON_UNQUOTE(JSON_EXTRACT(dados,'$.data'))) VIRTUAL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  actualizado_por VARCHAR(64) NULL
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS regiao (id VARCHAR(64) NOT NULL PRIMARY KEY, dados JSON NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, actualizado_por VARCHAR(64) NULL) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS config (id VARCHAR(64) NOT NULL PRIMARY KEY, dados JSON NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, actualizado_por VARCHAR(64) NULL) DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS relatorios (id VARCHAR(64) NOT NULL PRIMARY KEY, dados JSON NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, actualizado_por VARCHAR(64) NULL) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS utilizadores (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  papel VARCHAR(20) NOT NULL DEFAULT 'leitor',  -- admin | tesoureiro | leitor
  salt VARCHAR(64) NOT NULL,
  hash VARCHAR(128) NOT NULL,                   -- PBKDF2-SHA256, 150 000 voltas
  alg VARCHAR(16) NOT NULL DEFAULT 'pbkdf2',
  senha_alterada TINYINT(1) NOT NULL DEFAULT 0,
  ultimo_login DATETIME NULL,
  total_logins INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  visto_em DATETIME NULL                        -- última actividade (para saber quem está ligado agora)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS acessos (            -- cada entrada no sistema (com sucesso ou não)
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
) DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Tabelas "espelho" (a API reescreve-as a cada gravação, para consultar sem JSON)
CREATE TABLE IF NOT EXISTS cotas (membro_id VARCHAR(64) NOT NULL, membro VARCHAR(200), ano SMALLINT NOT NULL, mes TINYINT NOT NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, PRIMARY KEY (membro_id,ano,mes));
CREATE TABLE IF NOT EXISTS lideranca (cargo VARCHAR(40) NOT NULL PRIMARY KEY, cargo_nome VARCHAR(80), nome VARCHAR(200));
CREATE TABLE IF NOT EXISTS regiao_direccoes (id VARCHAR(64) NOT NULL PRIMARY KEY, nome VARCHAR(200), ordem INT);
CREATE TABLE IF NOT EXISTS regiao_quotas (direccao_id VARCHAR(64) NOT NULL, direccao VARCHAR(200), ano SMALLINT NOT NULL, mes TINYINT NOT NULL, valor DECIMAL(14,2) NOT NULL DEFAULT 0, PRIMARY KEY (direccao_id,ano,mes));
CREATE TABLE IF NOT EXISTS regiao_conferencias (id VARCHAR(64) NOT NULL, direccao_id VARCHAR(64) NOT NULL, conferencia VARCHAR(200), ano SMALLINT, direccao VARCHAR(200), meta DECIMAL(14,2) NULL, valor DECIMAL(14,2) NULL, PRIMARY KEY (id,direccao_id));
-- Vistas (criadas pela API): jovens, ofertas, saidas, contribuicoes, contribuicoes_entradas, conferencias
