CREATE DATABASE IF NOT EXISTS rivals_counter;
USE rivals_counter;

-- Tabela de Usuários (igual ao do professor)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('usuario', 'admin') DEFAULT 'usuario'
);

-- Tabela de Heróis (Adaptado para o seu tema)
CREATE TABLE herois (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    funcao VARCHAR(50) NOT NULL
);

-- Tabela de Counters (Adaptado para o seu tema)
CREATE TABLE counters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_id INT NOT NULL,
    counter_hero_id INT NOT NULL,
    dica_tatica TEXT,
    FOREIGN KEY (hero_id) REFERENCES herois(id),
    FOREIGN KEY (counter_hero_id) REFERENCES herois(id)
);

-- Inserindo dados de teste (Mock)
INSERT INTO herois (nome, funcao) VALUES 
('Peni Parker', 'Vanguard'), ('Groot', 'Vanguard'), 
('Hela', 'Duelist'), ('Homem de Ferro', 'Duelist'), ('Wolverine', 'Duelist');

INSERT INTO counters (hero_id, counter_hero_id, dica_tatica) VALUES 
(1, 4, 'Voa e ataca à distância, ignorando as minas.'),
(2, 5, 'Dano corpo a corpo alto, quebra a parede rápido.');