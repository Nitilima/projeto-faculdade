const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

const expensesRouter = require('./src/routes/expenses');
app.use('/expenses', expensesRouter);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
