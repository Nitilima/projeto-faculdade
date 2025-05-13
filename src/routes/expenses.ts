import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" }
  });
  res.json(expenses);
});

router.post("/", async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }

  const newExpense = await prisma.expense.create({
    data: {
      amount: Number(amount),
      category,
      description,
      date: new Date(date),
    },
  });

  res.status(201).json(newExpense);
});

export default router;
