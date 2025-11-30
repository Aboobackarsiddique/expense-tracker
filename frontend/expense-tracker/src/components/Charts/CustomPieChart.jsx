import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const CustomPieChart = ({
  data,
  label,
  totalAmount,
  colors = [],
  showTextAnchor,
}) => {
  // Check if data is valid and has entries
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white mt-6 p-4 text-center text-gray-500">
        No data to display.
      </div>
    );
  }

  // Filter out entries with zero or invalid amounts
  const validData = data.filter(item => item && (item.amount > 0 || item.value > 0));

  if (validData.length === 0) {
    return (
      <div className="bg-white mt-6 p-4 text-center text-gray-500">
        No data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={validData}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {validData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors && colors.length > 0 ? colors[index % colors.length] : '#10b981'}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fill="#374151"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="#1f2937"
              fontSize="24px"
              fontWeight="semi-bold"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};