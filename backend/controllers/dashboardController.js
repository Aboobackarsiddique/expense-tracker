const Income = require('../models/Income.js');
const Expense = require('../models/Expense.js');
const { isValidObjectId, Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(userId);

        // Fetch aggregated totals
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get income transactions in last 60 days
        const last60DaysIncomeTransaction = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const totalLast60DaysIncome = last60DaysIncomeTransaction.reduce((total, t) => total + (t.amount || 0), 0);

        // Get expense transactions in last 30 days
        const last30DaysExpenseTransaction = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const totalLast30DaysExpense = last30DaysExpenseTransaction.reduce((total, t) => total + (t.amount || 0), 0);

        // Normalizers: ensure consistent shape for frontend
        const normalizeExpense = (txn) => ({
            _id: txn._id,
            category: txn.category || txn.name || txn.title || '',
            icon: txn.icon || '',
            date: txn.date || txn.createdAt || new Date(),
            amount: txn.amount || txn.value || 0,
            type: 'expense',
        });

        const normalizeIncome = (txn) => ({
            _id: txn._id,
            category: txn.source || txn.name || '',
            icon: txn.icon || '',
            date: txn.date || txn.createdAt || new Date(),
            amount: txn.amount || txn.value || 0,
            type: 'income',
        });

        // Last 5 transactions (expenses + incomes) normalized
        const lastExpenses = (await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(normalizeExpense);
        const lastIncomes = (await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(normalizeIncome);
        const lastTransactions = [...lastExpenses, ...lastIncomes].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Normalize last30Days expense transactions for frontend
        const normalizedLast30Days = last30DaysExpenseTransaction.map(normalizeExpense);

        // Final response
        res.status(200).json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: totalLast30DaysExpense,
                transactions: normalizedLast30Days,
            },
            last60DaysIncome: {
                total: totalLast60DaysIncome,
                transactions: last60DaysIncomeTransaction.map(normalizeIncome),
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};
    


