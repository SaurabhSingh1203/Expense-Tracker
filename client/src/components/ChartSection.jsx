import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const palette = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2", "#be123c", "#475569"];

export default function ChartSection({ categoryTotals, monthlyTotals }) {
  const categoryLabels = Object.keys(categoryTotals);
  const monthLabels = Object.keys(monthlyTotals).sort();

  return (
    <section className="charts-grid">
      <div className="panel chart-panel">
        <h2>Spending by Category</h2>
        {categoryLabels.length ? (
          <Doughnut
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  data: categoryLabels.map((label) => categoryTotals[label]),
                  backgroundColor: palette
                }
              ]
            }}
          />
        ) : (
          <p className="empty">Add expenses to see category totals.</p>
        )}
      </div>

      <div className="panel chart-panel">
        <h2>Monthly Spending</h2>
        {monthLabels.length ? (
          <Bar
            data={{
              labels: monthLabels,
              datasets: [
                {
                  label: "Monthly total",
                  data: monthLabels.map((label) => monthlyTotals[label]),
                  backgroundColor: "#2563eb",
                  borderRadius: 6
                }
              ]
            }}
            options={{
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        ) : (
          <p className="empty">Add expenses to see monthly trends.</p>
        )}
      </div>
    </section>
  );
}
