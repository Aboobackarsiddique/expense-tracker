import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUSerAuth } from '../../hooks/useUSerAuth';
import { LuPlus, LuTrendingUp, LuTrendingDown, LuTriangle } from 'react-icons/lu';
import AddBudgetModal from '../../components/Modals/AddBudgetModal';

const Budgets = () => {
  useUSerAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  const fetchBudgets = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // For demo purposes, using localStorage to simulate budgets
      const savedBudgets = localStorage.getItem('budgets');
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      }
    } catch (error) {
      console.log("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const getBudgetStatus = (budget) => {
    const spent = budget.spent || 0;
    const limit = budget.limit;
    const percentage = (spent / limit) * 100;

    if (percentage >= 90) return { status: 'danger', color: 'text-red-600', bg: 'bg-red-50' };
    if (percentage >= 75) return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { status: 'good', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  return (
    <DashboardLayout activeMenu="Budgets">
      <div className="my-5 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
            <p className="text-gray-600 mt-1">Set and track your spending limits by category</p>
          </div>
          <button
            onClick={() => setShowAddBudget(true)}
            className="btn-success flex items-center gap-2"
          >
            <LuPlus size={20} />
            Add Budget
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuTrendingUp size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No budgets set</h3>
            <p className="text-gray-600 mb-6">Create your first budget to start tracking your spending</p>
            <button
              onClick={() => setShowAddBudget(true)}
              className="btn-success"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const status = getBudgetStatus(budget);
              const spent = budget.spent || 0;
              const remaining = budget.limit - spent;
              const percentage = Math.min((spent / budget.limit) * 100, 100);

              return (
                <div key={budget._id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {budget.icon || '💰'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                        <p className="text-sm text-gray-500">Monthly Budget</p>
                      </div>
                    </div>
                    {percentage >= 90 && (
                      <LuTriangle className="text-red-500" size={20} />
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Spent</span>
                      <span className="text-sm font-medium text-gray-800">
                        ₹{spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status.status === 'danger' ? 'bg-red-500' :
                          status.status === 'warning' ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${status.bg}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className={`text-lg font-semibold ${status.color}`}>
                          ₹{remaining.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Used</p>
                        <p className={`text-lg font-semibold ${status.color}`}>
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AddBudgetModal
          isOpen={showAddBudget}
          onClose={() => setShowAddBudget(false)}
          onSuccess={fetchBudgets}
        />
      </div>
    </DashboardLayout>
  );
};

export default Budgets;