import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", gastos: 5000 },
  { month: "Feb", gastos: 7000 },
  { month: "Mar", gastos: 6500 },
  { month: "Apr", gastos: 8000 },
  { month: "May", gastos: 7200 },
  { month: "Jun", gastos: 9000 },
];

export default function EvolucaoGastos() {
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
