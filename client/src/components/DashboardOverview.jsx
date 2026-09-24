export default function DashboardOverview({ stats, averageMonthlySpend }) {
  const topCategories = Object.entries(stats.categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <section className="panel overview-panel">
      <div>
        <h2>Financial Snapshot</h2>
        <p className="muted">A single-page summary of spending, trends, and planning numbers.</p>
      </div>

      <div className="overview-grid">
        <div className="overview-item">
          <span>Average monthly spend</span>
          <strong>${averageMonthlySpend.toFixed(2)}</strong>
        </div>
        <div className="overview-item">
          <span>Biggest category</span>
          <strong>{stats.highestCategory.name}</strong>
        </div>
        <div className="overview-item">
          <span>Tracked total</span>
          <strong>${stats.total.toFixed(2)}</strong>
        </div>
      </div>

      <div className="category-rankings">
        {topCategories.map(([category, amount]) => (
          <div key={category}>
            <span>{category}</span>
            <strong>${amount.toFixed(2)}</strong>
          </div>
        ))}
        {topCategories.length === 0 && <p className="empty">Add expenses to fill this snapshot.</p>}
      </div>
    </section>
  );
}
