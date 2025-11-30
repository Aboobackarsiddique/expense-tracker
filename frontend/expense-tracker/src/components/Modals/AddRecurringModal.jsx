import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuX } from 'react-icons/lu';
import Input from '../Inputs/input';
import toast from 'react-hot-toast';

const AddRecurringModal = ({ isOpen, onClose, onSuccess }) => {
  const [icon, setIcon] = useState('🔄');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, save to localStorage
      const newTransaction = {
        _id: Date.now().toString(),
        icon,
        description,
        amount: Number(amount),
        category,
        type,
        frequency,
        startDate,
        endDate: endDate || null,
        createdAt: new Date().toISOString(),
      };

      const existingTransactions = JSON.parse(localStorage.getItem('recurringTransactions') || '[]');
      const updatedTransactions = [...existingTransactions, newTransaction];
      localStorage.setItem('recurringTransactions', JSON.stringify(updatedTransactions));

      toast.success('Recurring transaction created successfully!');
      // Reset form
      setIcon('🔄');
      setDescription('');
      setAmount('');
      setCategory('');
      setType('expense');
      setFrequency('monthly');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setShowEmojiPicker(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to create recurring transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Create Recurring Transaction</h2>
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

          {/* Type Selection */}
          <div className="mb-4">
            <label className="text-[13px] text-slate-800 mb-2 block">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  type === 'income'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  type === 'expense'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Description */}
          <Input
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            label="Description"
            placeholder="e.g., Monthly Salary, Rent Payment"
            type="text"
          />

          {/* Category */}
          <Input
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            label="Category"
            placeholder="e.g., Salary, Rent, Utilities"
            type="text"
          />

          {/* Amount */}
          <Input
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            label="Amount"
            placeholder="Enter amount"
            type="number"
          />

          {/* Frequency */}
          <div className="mb-4">
            <label className="text-[13px] text-slate-800 mb-2 block">Frequency</label>
            <div className="input-box">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="text-[13px] text-slate-800 mb-2 block">Start Date</label>
            <div className="input-box">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* End Date (Optional) */}
          <div className="mb-4">
            <label className="text-[13px] text-slate-800 mb-2 block">End Date (Optional)</label>
            <div className="input-box">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent outline-none"
                min={startDate}
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
              {loading ? 'Creating...' : 'Create Recurring'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecurringModal;