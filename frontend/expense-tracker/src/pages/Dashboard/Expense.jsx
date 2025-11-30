import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUSerAuth } from '../../hooks/useUSerAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { prepareExpenseLineChartData } from '../../utils/helper';
import ExpenseLineChart from '../../components/Charts/ExpenseLineChart';
import { TransactionInfoCard } from '../../components/Cards/TransactionInfoCard';
import AddExpenseModal from '../../components/Modals/AddExpenseModal';
import moment from 'moment';
import toast from 'react-hot-toast';
import { LuPlus, LuDownload } from 'react-icons/lu';

function Expense() {
  useUSerAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSES);
      if (response.data) {
        setExpenses(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch expense data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(expenseId));
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE_EXCEL, {
        responseType: 'blob',
      });
      
      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Expense_details_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      toast.error('Failed to download Excel file');
    }
  };

  // Prepare chart data
  const chartData = useMemo(() => prepareExpenseLineChartData(expenses), [expenses]);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
            >
              <LuPlus size={20} />
              Add Expense
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Track your spending trends over time and gain insights into where your money goes.
          </p>
        </div>

        {/* Chart */}
        <div className="card mb-6">
          <ExpenseLineChart data={chartData} />
        </div>

        {/* Expense List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
            {expenses.length > 0 && (
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md text-sm"
              >
                <LuDownload size={18} />
                Download
              </button>
            )}
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expense records found. Click "Add Expense" to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <TransactionInfoCard
                  key={expense._id}
                  title={expense.category}
                  icon={expense.icon}
                  date={moment(expense.date).format("Do MMM YYYY")}
                  amount={expense.amount}
                  type="expense"
                  onDelete={() => handleDelete(expense._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchExpenses}
      />
    </DashboardLayout>
  );
}

export default Expense;
