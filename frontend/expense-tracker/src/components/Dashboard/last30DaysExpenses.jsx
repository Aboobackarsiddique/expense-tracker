import React, { useMemo } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({ data }) => {
    // compute derived chart data synchronously without setState in an effect
    const chartData = useMemo(() => prepareExpenseBarChartData(data), [data]);

    return (
        <div className="card col-span-1">
            
            <div className="flex items-center justify-between">
                <h5 className="text-lg text-gray-800">Last 30 Days Expenses</h5>
            </div>
            <CustomBarChart data={chartData} />
        </div>
    );
}

export default Last30DaysExpenses;
