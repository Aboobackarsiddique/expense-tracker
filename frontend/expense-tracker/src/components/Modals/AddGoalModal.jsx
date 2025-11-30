import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuX } from 'react-icons/lu';
import Input from '../Inputs/input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import toast from 'react-hot-toast';

const AddGoalModal = ({ isOpen, onClose, onSuccess }) => {
  const [icon, setIcon] = useState('🎯');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [category, setCategory] = useState('savings');
  const [targetDate, setTargetDate] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !targetAmount) {
      toast.error('Please fill in title and target amount');
      return;
    }

    if (isNaN(targetAmount) || Number(targetAmount) <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATH.GOAL.CREATE_GOAL, {
        icon,
        title,
        description,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        category,
        targetDate: targetDate || null,
      });

      if (response.data) {
        toast.success('Goal created successfully!');
        // Reset form
        setIcon('🎯');
        setTitle('');
        setDescription('');
        setTargetAmount('');
        setCurrentAmount('0');
        setCategory('savings');
        setTargetDate('');
        setShowEmojiPicker(false);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Goal</h2>
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

          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Title"
            placeholder="e.g., Save for Vacation"
            type="text"
          />

          {/* Description */}
          <div>
            <label className="text-[13px] text-slate-800">Description</label>
            <div className="input-box">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full bg-transparent outline-none resize-none"
                rows="3"
              />
            </div>
          </div>

          {/* Target Amount */}
          <Input
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            label="Target Amount"
            placeholder="Enter target amount"
            type="number"
          />

          {/* Current Amount */}
          <Input
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            label="Current Amount"
            placeholder="Enter current amount"
            type="number"
          />

          {/* Category */}
          <div>
            <label className="text-[13px] text-slate-800">Category</label>
            <div className="input-box">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="savings">Savings</option>
                <option value="expense">Expense Limit</option>
                <option value="income">Income Target</option>
              </select>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="text-[13px] text-slate-800">Date (Optional)</label>
            <div className="input-box">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-transparent outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

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
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;

