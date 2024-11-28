use Kanban;

create Table tarefa(
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    lista int NOT NULL,
    posicao int NOT NULL UNIQUE,
    FOREIGN KEY (lista) REFERENCES Lista(id)
);

create INDEX idx_posicao ON tarefa (posicao);

