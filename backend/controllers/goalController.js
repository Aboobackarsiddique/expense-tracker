const Goal = require('../models/Goal');

// Create a new goal
exports.createGoal = async (req, res) => {
    const userId = req.user._id;
    try {
        const { title, description, targetAmount, currentAmount, category, targetDate, icon } = req.body;
        
        if (!title || !targetAmount) {
            return res.status(400).json({ message: 'Please provide title and target amount' });
        }

        const newGoal = new Goal({
            userId,
            title,
            description: description || '',
            targetAmount,
            currentAmount: currentAmount || 0,
            category: category || 'savings',
            targetDate: targetDate ? new Date(targetDate) : null,
            icon: icon || '🎯',
        });

        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
};

// Get all goals for a user
exports.getAllGoals = async (req, res) => {
    const userId = req.user._id;
    try {
        const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goals', error: error.message });
    }
};

// Update a goal
exports.updateGoal = async (req, res) => {
    const userId = req.user._id;
    try {
        const { title, description, targetAmount, currentAmount, category, targetDate, status, icon } = req.body;
        
        const goal = await Goal.findOne({ _id: req.params.id, userId });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (title) goal.title = title;
        if (description !== undefined) goal.description = description;
        if (targetAmount) goal.targetAmount = targetAmount;
        if (currentAmount !== undefined) goal.currentAmount = currentAmount;
        if (category) goal.category = category;
        if (targetDate) goal.targetDate = new Date(targetDate);
        if (status) goal.status = status;
        if (icon) goal.icon = icon;

        // Auto-update status if currentAmount >= targetAmount
        if (goal.currentAmount >= goal.targetAmount && goal.status !== 'completed') {
            goal.status = 'completed';
        }

        await goal.save();
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error: error.message });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    const userId = req.user._id;
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal', error: error.message });
    }
};

// Get goal progress
exports.getGoalProgress = async (req, res) => {
    const userId = req.user._id;
    try {
        const goals = await Goal.find({ userId, status: 'active' });
        const progress = goals.map(goal => ({
            goalId: goal._id,
            title: goal.title,
            progress: (goal.currentAmount / goal.targetAmount) * 100,
            currentAmount: goal.currentAmount,
            targetAmount: goal.targetAmount,
        }));
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goal progress', error: error.message });
    }
};

