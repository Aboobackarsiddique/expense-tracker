import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuX } from 'react-icons/lu';
import Input from '../Inputs/input';
import toast from 'react-hot-toast';

const AddBudgetModal = ({ isOpen, onClose, onSuccess }) => {
  const [icon, setIcon] = useState('💰');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !limit) {
      toast.error('Please fill in category and budget limit');
      return;
    }

    if (isNaN(limit) || Number(limit) <= 0) {
      toast.error('Please enter a valid budget limit');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, save to localStorage
      const newBudget = {
        _id: Date.now().toString(),
        icon,
        category,
        limit: Number(limit),
        spent: 0, // Initialize spent amount
        createdAt: new Date().toISOString(),
      };

      const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      const updatedBudgets = [...existingBudgets, newBudget];
      localStorage.setItem('budgets', JSON.stringify(updatedBudgets));

      toast.success('Budget created successfully!');
      // Reset form
      setIcon('💰');
      setCategory('');
      setLimit('');
      setShowEmojiPicker(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Create Budget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Emoji Picker */}
          <div className="mb-4">
            <label className="text-[13px] text-slate-800 mb-2 block">Icon</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-16 h-16 flex items-center justify-center text-3xl bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                {icon}
              </button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setIcon(emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    height={400}
                    width={350}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <Input
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            label="Category"
            placeholder="e.g., Food, Transportation, Entertainment"
            type="text"
          />

          {/* Budget Limit */}
          <Input
            value={limit}
            onChange={({ target }) => setLimit(target.value)}
            label="Monthly Budget Limit"
            placeholder="Enter budget amount"
            type="number"
          />

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;