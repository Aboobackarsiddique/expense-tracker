import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded px-2 py-1 border border-gray-300">
        <p className="text-xs font-semibold text-emerald-700 mb-1">
          {payload[0].payload.date}
        </p>
        <p className="text-xs text-gray-600">
          Amount:{" "}
          <span className="text-sm font-medium text-gray-800">
            ₹{payload[0].payload.amount}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const IncomeBarChart = ({ data }) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="bg-white mt-6 p-4 text-center text-gray-500">
        No income data to display.
      </div>
    );
  }

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#555" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', fill: '#555' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="#10b981" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill="#10b981" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeBarChart;

