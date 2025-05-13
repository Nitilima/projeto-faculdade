const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, description: 'Aluguel', amount: 1500 },
    { id: 2, description: 'Supermercado', amount: 300 },
  ]);
});

router.post('/', (req, res) => {
  const { description, amount } = req.body;
  if (!description || !amount) {
    return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
  }
  const newExpense = { id: Date.now(), description, amount };
  res.status(201).json(newExpense);
});

module.exports = router;