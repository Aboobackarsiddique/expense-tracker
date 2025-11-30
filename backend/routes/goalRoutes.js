const express = require('express');
const {
    createGoal,
    getAllGoals,
    updateGoal,
    deleteGoal,
    getGoalProgress
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createGoal);
router.get('/get', protect, getAllGoals);
router.put('/update/:id', protect, updateGoal);
router.delete('/delete/:id', protect, deleteGoal);
router.get('/progress', protect, getGoalProgress);

module.exports = router;

