import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyExpense {
  month: string;
  gastos: number;
}

export default function GraficoAnalises() {
  const [data, setData] = useState<MonthlyExpense[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/expenses/monthly")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, []);

  return (
    <div className="p-6 rounded-lg bg-[#f6f6f6] mt-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="gastos"
            stroke="#357ade"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
