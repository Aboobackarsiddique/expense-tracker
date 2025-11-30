const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    category: { type: String, enum: ['savings', 'expense', 'income'], default: 'savings' },
    targetDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    icon: { type: String, default: '🎯' },
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);

