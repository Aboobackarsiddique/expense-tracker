import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUSerAuth } from '../../hooks/useUSerAuth';
import { LuPlus, LuRepeat, LuCalendar, LuTrendingUp, LuTrendingDown } from 'react-icons/lu';
import AddRecurringModal from '../../components/Modals/AddRecurringModal';

const RecurringTransactions = () => {
  useUSerAuth();
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);

  const fetchRecurringTransactions = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // For demo purposes, using localStorage to simulate recurring transactions
      const savedTransactions = localStorage.getItem('recurringTransactions');
      if (savedTransactions) {
        setRecurringTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.log("Error fetching recurring transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return frequency;
    }
  };

  const getNextDueDate = (startDate, frequency) => {
    const start = new Date(startDate);
    const now = new Date();

    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly': {
        const daysUntilNextWeek = (7 - now.getDay() + start.getDay()) % 7 || 7;
        return new Date(now.getTime() + daysUntilNextWeek * 24 * 60 * 60 * 1000);
      }
      case 'monthly': {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, start.getDate());
        return nextMonth;
      }
      case 'yearly': {
        const nextYear = new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
        return nextYear;
      }
      default:
        return start;
    }
  };

  return (
    <DashboardLayout activeMenu="Recurring">
      <div className="my-5 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Recurring Transactions</h1>
            <p className="text-gray-600 mt-1">Set up automatic recurring income and expenses</p>
          </div>
          <button
            onClick={() => setShowAddRecurring(true)}
            className="btn-success flex items-center gap-2"
          >
            <LuPlus size={20} />
            Add Recurring
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : recurringTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuRepeat size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No recurring transactions</h3>
            <p className="text-gray-600 mb-6">Set up recurring income or expenses to automate your financial tracking</p>
            <button
              onClick={() => setShowAddRecurring(true)}
              className="btn-success"
            >
              Create Your First Recurring Transaction
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recurringTransactions.map((transaction) => {
              const nextDue = getNextDueDate(transaction.startDate, transaction.frequency);
              const isIncome = transaction.type === 'income';

              return (
                <div key={transaction._id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {transaction.icon || (isIncome ? '💰' : '💸')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isIncome ? <LuTrendingUp size={12} /> : <LuTrendingDown size={12} />}
                      {isIncome ? 'Income' : 'Expense'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className={`text-lg font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Frequency</span>
                      <span className="text-sm font-medium text-gray-800">
                        {getFrequencyLabel(transaction.frequency)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Next Due</span>
                      <span className="text-sm font-medium text-gray-800 flex items-center gap-1">
                        <LuCalendar size={14} />
                        {nextDue.toLocaleDateString()}
                      </span>
                    </div>

                    {transaction.endDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ends</span>
                        <span className="text-sm font-medium text-gray-800">
                          {new Date(transaction.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Started {new Date(transaction.startDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <LuRepeat size={12} />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AddRecurringModal
          isOpen={showAddRecurring}
          onClose={() => setShowAddRecurring(false)}
          onSuccess={fetchRecurringTransactions}
        />
      </div>
    </DashboardLayout>
  );
};

export default RecurringTransactions;