import express from "express";
import expensesRouter from "./routes/expenses";

const app = express();

app.use(express.json());
app.use("/expenses", expensesRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});