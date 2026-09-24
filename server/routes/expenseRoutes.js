import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

function buildFilter(userId, query) {
  const filter = { user: userId };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  return filter;
}

router.get("/", async (req, res, next) => {
  try {
    const expenses = await Expense.find(buildFilter(req.user._id, req.query)).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Amount, category, and date are required." });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero." });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount: Number(amount),
      category,
      date,
      note
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Amount, category, and date are required." });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero." });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { amount: Number(amount), category, date, note },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.json({ message: "Expense deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
