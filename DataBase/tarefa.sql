-- Este script define a tabela 'tarefa' no banco de dados 'Kanban', 
-- com colunas para armazenar informações sobre tarefas no quadro Kanban.
-- Inclui um identificador único, nome, descrição, e referência à lista a que pertence.
use Kanban;

create Table tarefa(
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    lista int NOT NULL,
    FOREIGN KEY (lista) REFERENCES Lista(id),
    posicao INT NOT NULL
);


