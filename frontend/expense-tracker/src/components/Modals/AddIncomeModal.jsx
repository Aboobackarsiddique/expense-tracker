import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuX } from 'react-icons/lu';
import Input from '../Inputs/input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import toast from 'react-hot-toast';

const AddIncomeModal = ({ isOpen, onClose, onSuccess }) => {
  const [icon, setIcon] = useState('💰');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!source || !amount || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, {
        icon,
        source,
        amount: Number(amount),
        date,
      });

      if (response.data) {
        toast.success('Income added successfully!');
        // Reset form
        setIcon('💰');
        setSource('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setShowEmojiPicker(false);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Add Income</h2>
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

          {/* Source */}
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            label="Source"
            placeholder="e.g., Salary, Freelancing"
            type="text"
          />

          {/* Amount */}
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Amount"
            placeholder="Enter amount"
            type="number"
          />

          {/* Date */}
          <div>
            <label className="text-[13px] text-slate-800">Date</label>
            <div className="input-box">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none"
                max={new Date().toISOString().split('T')[0]}
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
              {loading ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;

