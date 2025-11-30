import React from 'react'
import { CustomPieChart } from '../Charts/CustomPieChart'

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const COLORS = ["#10b981", "#FA2C37","#FF6900"]
    const BalanceData = [
        {
            name:"Total Balance",
            amount: totalBalance
        },
        {
            name:"Total Income",
            amount: totalIncome
        },
        {
            name:"Total Expense",
            amount: totalExpense
        }
    ]
  return <div className='card'>
       <div className='flex items-center justify-between'>
        <h5 className='text-lg text-gray-800'>Finance Overview</h5>
       </div>
       <CustomPieChart
       data={BalanceData}
       label="Total Balance"
       totalAmount={`₹${totalBalance}`}
       colors={COLORS}
       showTextAnchor
       />
  </div>
  
}

export default FinanceOverview
