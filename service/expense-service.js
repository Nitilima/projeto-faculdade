import { log } from 'console'
import express from 'express'
import sqlite3 from 'sqlite3'

const app = express()
const db = new sqlite3.Database('./expenses.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco', err)
    } else {
        console.log('Banco conectado');

        db.run(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                amount REAL NOT NULL
                )
            `)
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('servidor rodando!')
})

app.get('/expenses', (req, res) =>{
    db.all('SELECT * FROM expenses', (err, rows) =>{
        if (err){
            return res.status(500).json({message: 'erro ao buscar'})
        }
    })
})

app.post('/expenses', (req, res) => {
    const { description, amount } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
    }
  
    const query = 'INSERT INTO expenses (description, amount) VALUES (?, ?)';
    db.run(query, [description, amount], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao adicionar despesa' });
      }
      res.status(201).json({
        id: this.lastID,
        description,
        amount
      });
    });
  });
  
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });