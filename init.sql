-- Criação do banco de dados (caso não exista)
CREATE DATABASE IF NOT EXISTS fortniteprojeto;
USE fortniteprojeto;

-- Tabela de usuários
CREATE TABLE `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  `vbucks` INT DEFAULT 0,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabela de itens do usuário
CREATE TABLE `itensusuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idItem` VARCHAR(45) NOT NULL,
  `usuarioId` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `regularPrice` VARCHAR(45) DEFAULT NULL,
  `excluido` TINYINT(1) DEFAULT 0,
  `dataRegistro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `dataExclusao` DATETIME DEFAULT NULL,
  `imagem` VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


