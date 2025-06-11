import express from 'express'
import mysql from 'mysql2/promise'
import('dotenv')

const app = express();
const PORT = 3000;

app.use(express.json())

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const initializeDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amont REAL NOT NULL)
    `);

  await connection.end();
}

app.get('/expenses', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM expenses');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
});

app.get('/expenses/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Despesa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar despesa', error: error.message });
  }
});

app.post('/expenses', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO expenses (description, amount) VALUES (?, ?)',
      [name, email]
    );

    const [newUser] = await connection.execute('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
    await connection.end();

    res.status(201).json(newUser[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email já está em uso' });
    } else {
      res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
  }
});

app.put('/expenses/:id', async (req, res) => {
  try {
    const { description, amount } = req.body;
    const userId = req.params.id;

    const connection = await mysql.createConnection(dbConfig);

    const [userCheck] = await connection.execute('SELECT * FROM expenses WHERE id = ?', [userId]);
    if (userCheck.length === 0) {
      await connection.end();
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await connection.execute(
      'UPDATE expenses SET description = COALESCE(?, description), amount = COALESCE(?, amount) WHERE id = ?',
      [description, amount, userId]
    );

    const [updatedUser] = await connection.execute('SELECT * FROM expenses WHERE id = ?', [userId]);
    await connection.end();

    res.json(updatedUser[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: '' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
  }
});

app.delete('/expenses/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = await mysql.createConnection(dbConfig);

    const [userCheck] = await connection.execute('SELECT * FROM expenses WHERE id = ?', [userId]);
    if (userCheck.length === 0) {
      await connection.end();
      return res.status(404).json({ message: 'Despesa não enc' });
    }

    await connection.execute('DELETE FROM expenses WHERE id = ?', [userId]);
    await connection.end();

    res.json({ message: 'Despesa deletada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover despesa', error: error.message });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Conectado ao MySQL em ${dbConfig.host}:${dbConfig.port}`);
  });
}).catch(error => {
  console.error('Falha ao inicializar o banco de dados:', error);
  process.exit(1);
});