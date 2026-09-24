import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: 160,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
