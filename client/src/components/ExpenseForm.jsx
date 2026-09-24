import { useEffect, useState } from "react";

const categories = ["Housing", "Food", "Transportation", "Utilities", "Health", "Entertainment", "Shopping", "Other"];

const emptyForm = {
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  note: ""
};

export default function ExpenseForm({ editingExpense, onCancelEdit, onSubmit }) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date.slice(0, 10),
        note: editingExpense.note || ""
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingExpense]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
    if (!editingExpense) setFormData(emptyForm);
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
        {editingExpense && (
          <button className="ghost" onClick={onCancelEdit} type="button">
            Cancel
          </button>
        )}
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          Amount
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
            required
          />
        </label>
        <label>
          Category
          <select
            value={formData.category}
            onChange={(event) => setFormData({ ...formData, category: event.target.value })}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input
            type="date"
            value={formData.date}
            onChange={(event) => setFormData({ ...formData, date: event.target.value })}
            required
          />
        </label>
        <label className="wide">
          Note
          <input
            maxLength="160"
            value={formData.note}
            onChange={(event) => setFormData({ ...formData, note: event.target.value })}
            placeholder="Optional note"
          />
        </label>
        <button className="primary">{editingExpense ? "Save Changes" : "Add Expense"}</button>
      </form>
    </section>
  );
}
