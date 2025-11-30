import React from "react";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded px-3 py-2 border border-gray-300">
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

const ExpenseLineChart = ({ data }) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="bg-white mt-6 p-4 text-center text-gray-500">
        No expense data to display.
      </div>
    );
  }

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            label={{ value: "Amount (₹)", angle: -90, position: "insideLeft", fill: "#555" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorAmount)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseLineChart;