const xlxs = require('xlsx');
const Expense = require('../models/Expense');
// Add Expense source
exports.addExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const { icon, category, amount, date } = req.body;
        // Validation
        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const newExpense = new Expense({ userId, icon, category, amount, date: new Date(date) });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: 'Error adding Expense source', error: error.message });
    }
};

// Get all expense sources for a user
exports.getAllExpenses = async (req, res) => {
    const userId = req.user._id;
    try{
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
        } catch (error) {
        res.status(500).json({ message: 'Error fetching expense sources', error: error.message });
    }
};

// Delete an expense source
exports.deleteExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        await Expense.findOneAndDelete({ _id: req.params.id, userId });
        res.status(200).json({ message: 'Expense source deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income source', error: error.message });
    }
};

// Download expense sources in Excel format
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        // Prepare Excel data with formatted dates
        const Data = expenses.map(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            return {
                Category: item.category,
                Amount: item.amount,
                Date: formattedDate
            };
        });
        const wb = xlxs.utils.book_new();
        const ws = xlxs.utils.json_to_sheet(Data);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 20 }, // Category column
            { wch: 15 }, // Amount column
            { wch: 15 }  // Date column
        ];
        
        xlxs.utils.book_append_sheet(wb, ws, 'Expenses');
        xlxs.writeFile(wb, 'Expense_details.xlsx');
        res.download('Expense_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: 'Error downloading Excel file', error: error.message });
    }

};