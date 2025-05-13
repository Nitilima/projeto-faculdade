import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expensesRoutes from "./routes/expenses";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/expenses", expensesRoutes);

app.listen(3001, () => console.log("API rodando em http://localhost:3001"));
