-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

-- Criar tabela de despesas
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR PRIMARY KEY,
    description VARCHAR,
    amount FLOAT NOT NULL,
    date DATE NOT NULL,
    month VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    user_id VARCHAR NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inserir categorias padrão
INSERT INTO categories (name) VALUES
    ('Alimentação'),
    ('Transporte'),
    ('Moradia'),
    ('Saúde'),
    ('Educação'),
    ('Lazer'),
    ('Vestuário'),
    ('Outros')
ON CONFLICT (name) DO NOTHING;
