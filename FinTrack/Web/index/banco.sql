-- Criação da base de dados
CREATE DATABASE IF NOT EXISTS GestaoFinanceira;
USE GestaoFinanceira;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL -- Senha criptografada
);

-- Tabela de Logins
CREATE TABLE IF NOT EXISTS Logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de Transações
CREATE TABLE IF NOT EXISTS Transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    categoria ENUM('renda', 'alimentacao', 'transporte', 'utilidades', 'entretenimento') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de Orçamentos
CREATE TABLE IF NOT EXISTS Orcamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria ENUM('renda', 'alimentacao', 'transporte', 'utilidades', 'entretenimento') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de Relatórios
CREATE TABLE IF NOT EXISTS Relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('mensal', 'anual', 'personalizado') NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    relatorio TEXT NOT NULL, -- Conteúdo do relatório em formato de texto
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS Categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL,
    tipo ENUM('renda', 'despesa') NOT NULL
);

-- Tabela de Orçamentos (versão refinada)
CREATE TABLE IF NOT EXISTS Orçamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id) ON DELETE CASCADE
);

-- Tabela de Histórico de Orçamentos
CREATE TABLE IF NOT EXISTS HistoricoOrçamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orçamento_id INT NOT NULL,
    data DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    status ENUM('Dentro do orçamento', 'Acima do orçamento') NOT NULL,
    FOREIGN KEY (orçamento_id) REFERENCES Orçamento(id) ON DELETE CASCADE
);

-- Tabela de Relatórios (estrutura alternativa para dados JSON)
CREATE TABLE IF NOT EXISTS RelatoriosJSON (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('income-expense', 'category-breakdown', 'budget-comparison', 'savings') NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    dados JSON NOT NULL, -- Dados do relatório em formato JSON
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);
