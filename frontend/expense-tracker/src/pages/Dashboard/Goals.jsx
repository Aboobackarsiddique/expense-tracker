import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUSerAuth } from '../../hooks/useUSerAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import AddGoalModal from '../../components/Modals/AddGoalModal';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2, LuCheck } from 'react-icons/lu';
import moment from 'moment';

function Goals() {
  useUSerAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.GOAL.GET_ALL_GOALS);
      if (response.data) {
        setGoals(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATH.GOAL.DELETE_GOAL(goalId));
      toast.success('Goal deleted successfully');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (goalId, newAmount) => {
    try {
      await axiosInstance.put(API_PATH.GOAL.UPDATE_GOAL(goalId), {
        currentAmount: newAmount,
      });
      toast.success('Goal progress updated');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout activeMenu="Goals">
      <div className="my-5 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">My Goals</h1>
            <button
              onClick={() => {
                setEditingGoal(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
            >
              <LuPlus size={20} />
              Create Goal
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Set financial goals and track your progress towards achieving them.
          </p>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No goals yet. Create your first goal to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const isCompleted = goal.status === 'completed' || progress >= 100;
              
              return (
                <div
                  key={goal._id}
                  className="card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {goal.title}
                        </h3>
                        {goal.category && (
                          <span className="text-xs text-gray-500 capitalize">
                            {goal.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <LuCheck className="text-white text-sm" />
                      </div>
                    )}
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        ₹{goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-600">
                        ₹{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {progress.toFixed(1)}% Complete
                    </p>
                  </div>

                  {goal.targetDate && (
                    <p className="text-xs text-gray-500 mb-4">
                      Target: {moment(goal.targetDate).format('MMM DD, YYYY')}
                    </p>
                  )}

                  {/* Update Progress */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      placeholder="Update amount"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-800"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            handleUpdateProgress(goal._id, value);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="flex-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <LuTrash2 size={16} />
                      Delete
                    </button>
                    {isCompleted && (
                      <button
                        onClick={async () => {
                          await axiosInstance.put(API_PATH.GOAL.UPDATE_GOAL(goal._id), {
                            status: 'active',
                            currentAmount: 0,
                          });
                          fetchGoals();
                        }}
                        className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSuccess={fetchGoals}
      />
    </DashboardLayout>
  );
}

export default Goals;

