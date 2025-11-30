const express = require('express');
const {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController.js');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addExpense);
router.get('/get', protect, getAllExpenses);
router.delete('/delete/:id', protect, deleteExpense);
router.get('/downloadExcel', protect, downloadExpenseExcel);

module.exports = router;