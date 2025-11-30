import React from "react";
import { CustomPieChart } from "../Charts/CustomPieChart";

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const COLORS = ["#10b981", "#FA2C37", "#FF6800", "#41F96B"];
  // Filter valid items and aggregate by category
  const validItems = (data || []).filter((item) => item && (item.amount > 0 || item.value > 0));
  
  // Group by category and sum amounts
  const categoryMap = {};
  validItems.forEach((item) => {
    const category = item?.category || item?.source || 'Uncategorized';
    const amount = Number(item?.amount || item?.value || 0);
    
    if (categoryMap[category]) {
      categoryMap[category] += amount;
    } else {
      categoryMap[category] = amount;
    }
  });
  
  // Convert to array format for chart
  const chartData = Object.entries(categoryMap).map(([name, amount]) => ({
    name,
    amount: Math.round(amount),
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-gray-800">Last 60 Days Income</h3>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`₹${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
