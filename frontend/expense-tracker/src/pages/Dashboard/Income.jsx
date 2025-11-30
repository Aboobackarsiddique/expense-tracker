import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUSerAuth } from '../../hooks/useUSerAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { prepareIncomeBarChartData } from '../../utils/helper';
import IncomeBarChart from '../../components/Charts/IncomeBarChart';
import { TransactionInfoCard } from '../../components/Cards/TransactionInfoCard';
import AddIncomeModal from '../../components/Modals/AddIncomeModal';
import moment from 'moment';
import toast from 'react-hot-toast';
import { LuPlus, LuDownload } from 'react-icons/lu';

function Income() {
  useUSerAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOMES);
      if (response.data) {
        setIncomes(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch income data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (incomeId) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(incomeId));
      toast.success('Income deleted successfully');
      fetchIncomes();
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME_EXCEL, {
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
      link.download = `Income_details_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  const chartData = useMemo(() => prepareIncomeBarChartData(incomes), [incomes]);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Income Overview</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
            >
              <LuPlus size={20} />
              Add Income
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        {/* Chart */}
        <div className="card mb-6">
          <IncomeBarChart data={chartData} />
        </div>

        {/* Income List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">All Income</h2>
            {incomes.length > 0 && (
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md text-sm"
              >
                <LuDownload size={18} />
                Download Excel
              </button>
            )}
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : incomes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No income records found. Click "Add Income" to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {incomes.map((income) => (
                <TransactionInfoCard
                  key={income._id}
                  title={income.source}
                  icon={income.icon}
                  date={moment(income.date).format("Do MMM YYYY")}
                  amount={income.amount}
                  type="income"
                  onDelete={() => handleDelete(income._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Income Modal */}
      <AddIncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchIncomes}
      />
    </DashboardLayout>
  );
}

export default Income;
