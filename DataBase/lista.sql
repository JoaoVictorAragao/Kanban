/*************  ✨ Codeium Command ⭐  *************/
-- Este script cria e utiliza o banco de dados 'Kanban', 
-- e define a tabela 'Lista' com colunas para armazenar 
-- informações sobre listas no quadro Kanban, incluindo 
-- um identificador único, nome, urgência e posição.
-- deve ser criado antes da table tarefa
/******  0db3abea-59b1-43ba-b333-7fc88f49590b  *******/
create database Kanban;

use Kanban;

CREATE TABLE Lista (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    urgencia ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    posicao INT NOT NULL
);


