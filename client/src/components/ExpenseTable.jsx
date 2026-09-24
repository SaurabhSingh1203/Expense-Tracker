export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>All Expenses</h2>
        <span className="pill">{expenses.length} records</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <span className="category-chip">{expense.category}</span>
                </td>
                <td>{expense.note || "No note"}</td>
                <td className="amount-cell">${expense.amount.toFixed(2)}</td>
                <td className="actions">
                  <button className="ghost" onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => onDelete(expense._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No expenses match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
