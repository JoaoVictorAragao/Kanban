create database Kanban;

use Kanban;

CREATE TABLE Lista (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    urgencia ENUM('baixa', 'media', 'alta') DEFAULT 'media'
);
