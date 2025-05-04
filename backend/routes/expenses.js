const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
});

router.post('/', auth, async (req, res) => {
    const { amount, description, category } = req.body;
    const expense = new Expense({ userId: req.user.id, amount, description, category });
    await expense.save();
    res.json(expense);
});

router.delete('/:id', auth, async (req, res) => {
    await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
});

module.exports = router;
