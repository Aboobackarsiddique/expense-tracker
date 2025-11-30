const xlxs = require('xlsx');
const Income = require('../models/Income');
// Add income source
exports.addIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const { icon, source, amount, date } = req.body;
        // Validation
        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const newIncome = new Income({ userId, icon, source, amount, date: new Date(date) });
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: 'Error adding income source', error: error.message });
    }
};

// Get all income sources for a user
exports.getAllIncomes = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income sources', error: error.message });
    }
};

// Delete an income source
exports.deleteIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        await Income.findOneAndDelete({ _id: req.params.id, userId });
        res.status(200).json({ message: 'Income source deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income source', error: error.message });
    }
};

// Download income sources in Excel format
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        // Prepare Excel data with formatted dates
        const Data = incomes.map(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            return {
                Source: item.source,
                Amount: item.amount,
                Date: formattedDate
            };
        });
        const wb = xlxs.utils.book_new();
        const ws = xlxs.utils.json_to_sheet(Data);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 20 }, // Source column
            { wch: 15 }, // Amount column
            { wch: 15 }  // Date column
        ];
        
        xlxs.utils.book_append_sheet(wb, ws, 'Incomes');
        xlxs.writeFile(wb, 'Income_details.xlsx');
        res.download('Income_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: 'Error downloading Excel file', error: error.message });
    }

};