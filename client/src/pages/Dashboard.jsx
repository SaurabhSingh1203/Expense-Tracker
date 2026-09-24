import { useEffect, useMemo, useState } from "react";
import BudgetCalculator from "../components/BudgetCalculator";
import ChartSection from "../components/ChartSection";
import DashboardOverview from "../components/DashboardOverview";
import EmergencyFundCalculator from "../components/EmergencyFundCalculator";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import InsightCard from "../components/InsightCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState("");
  const [insightError, setInsightError] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [budgetInputs, setBudgetInputs] = useState({
    income: "",
    savingsGoal: "20",
  });
  const [emergencyInputs, setEmergencyInputs] = useState({
    monthlyExpenses: "",
    currentSavings: "",
    targetMonths: "6",
    monthlyContribution: "200",
  });

  useEffect(() => {
    fetchExpenses();
    fetchInsight();
  }, []);

  async function fetchExpenses(nextFilters = filters) {
    try {
      const { data } = await api.get("/expenses", { params: nextFilters });
      setExpenses(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load expenses.");
    }
  }

  async function fetchInsight() {
    try {
      const { data } = await api.get("/insights/latest");
      setInsight(data.insight);
    } catch (err) {
      setInsightError(
        err.response?.data?.message || "Could not load saved insight.",
      );
    }
  }

  async function saveExpense(formData) {
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, formData);
        setEditingExpense(null);
      } else {
        await api.post("/expenses", formData);
      }
      await fetchExpenses();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save expense.");
    }
  }

  async function deleteExpense(id) {
    try {
      await api.delete(`/expenses/${id}`);
      await fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete expense.");
    }
  }

  async function generateInsight() {
    setInsightError("");
    setLoadingInsight(true);

    try {
      const { data } = await api.post("/insights/generate", {
        planning: planningSummary,
      });
      setInsight(data.insight);
    } catch (err) {
      setInsightError(
        err.response?.data?.message || "Could not generate insight.",
      );
    } finally {
      setLoadingInsight(false);
    }
  }

  function applyFilters(event) {
    event.preventDefault();
    fetchExpenses(filters);
  }

  const stats = useMemo(() => buildSummary(expenses), [expenses]);
  const recentTransactions = expenses.slice(0, 5);
  const averageMonthlySpend = useMemo(() => {
    const monthCount = Object.keys(stats.monthlyTotals).length;
    return monthCount ? stats.total / monthCount : 0;
  }, [stats]);
  const planningMonthlySpending = averageMonthlySpend || stats.total;

  const planningSummary = useMemo(
    () =>
      buildPlanningSummary(
        budgetInputs,
        emergencyInputs,
        planningMonthlySpending,
      ),
    [budgetInputs, emergencyInputs, planningMonthlySpending],
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Personal Finance Tracker</p>
          <h1>Dashboard</h1>
          <p className="topbar-subtitle">
            Track spending, plan savings, and generate AI-powered insights.
          </p>
        </div>
        <div className="user-actions">
          <span>{user?.name}</span>
          <button className="ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="stats-grid">
        <div className="stat stat-blue">
          <span>Total Expenses</span>
          <strong>${stats.total.toFixed(2)}</strong>
        </div>
        <div className="stat stat-green">
          <span>Highest Category</span>
          <strong>{stats.highestCategory.name}</strong>
        </div>
        <div className="stat stat-gold">
          <span>Transactions</span>
          <strong>{expenses.length}</strong>
        </div>
      </section>

      <nav className="tabs" aria-label="Dashboard sections">
        {[
          ["overview", "Overview"],
          ["expenses", "Expenses"],
          ["planning", "Planning"],
          ["insights", "AI Insights"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={activeTab === id ? "tab active" : "tab"}
            onClick={() => setActiveTab(id)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <>
          <DashboardOverview
            stats={stats}
            averageMonthlySpend={averageMonthlySpend}
          />
          <ChartSection
            categoryTotals={stats.categoryTotals}
            monthlyTotals={stats.monthlyTotals}
          />
          <section className="panel">
            <h2>Recent Transactions</h2>
            <div className="recent-list">
              {recentTransactions.map((expense) => (
                <div key={expense._id} className="recent-item">
                  <div>
                    <strong>{expense.category}</strong>
                    <span>
                      {expense.note ||
                        new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <strong>${expense.amount.toFixed(2)}</strong>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="empty">No transactions yet.</p>
              )}
            </div>
          </section>
        </>
      )}

      {activeTab === "expenses" && (
        <>
          <section className="panel">
            <div className="panel-heading">
              <h2>Filters</h2>
              <button
                className="ghost"
                onClick={() => {
                  const cleared = { category: "", startDate: "", endDate: "" };
                  setFilters(cleared);
                  fetchExpenses(cleared);
                }}
              >
                Reset
              </button>
            </div>
            <form className="filters" onSubmit={applyFilters}>
              <label>
                Category
                <input
                  value={filters.category}
                  onChange={(event) =>
                    setFilters({ ...filters, category: event.target.value })
                  }
                  placeholder="Food"
                />
              </label>
              <label>
                Start date
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters({ ...filters, startDate: event.target.value })
                  }
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters({ ...filters, endDate: event.target.value })
                  }
                />
              </label>
              <button className="primary">Apply Filters</button>
            </form>
          </section>

          <ExpenseForm
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
            onSubmit={saveExpense}
          />

          <ExpenseTable
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={deleteExpense}
          />
        </>
      )}

      {activeTab === "planning" && (
        <section className="planning-grid">
          <BudgetCalculator
            monthlySpending={planningMonthlySpending}
            budgetInputs={budgetInputs}
            onBudgetChange={setBudgetInputs}
          />
          <EmergencyFundCalculator
            estimatedMonthlyExpenses={planningMonthlySpending}
            emergencyInputs={emergencyInputs}
            onEmergencyChange={setEmergencyInputs}
          />
        </section>
      )}

      {activeTab === "insights" && (
        <InsightCard
          insight={insight}
          loading={loadingInsight}
          error={insightError}
          onGenerate={generateInsight}
        />
      )}
    </main>
  );
}

function buildPlanningSummary(budgetInputs, emergencyInputs, monthlySpending) {
  const hasBudgetInput = budgetInputs.income !== "";
  const hasEmergencyInput =
    emergencyInputs.monthlyExpenses !== "" ||
    emergencyInputs.currentSavings !== "" ||
    emergencyInputs.monthlyContribution !== "";

  const monthlyIncome = parseOptionalNumber(budgetInputs.income);
  const savingsGoalPercent = hasBudgetInput
    ? parseOptionalNumber(budgetInputs.savingsGoal) || 0
    : null;
  const savingsGoalAmount =
    monthlyIncome !== null && savingsGoalPercent !== null
      ? monthlyIncome * (savingsGoalPercent / 100)
      : null;
  const remainingAfterExpenses =
    monthlyIncome !== null ? monthlyIncome - monthlySpending : null;
  const remainingAfterSavingsGoal =
    remainingAfterExpenses !== null && savingsGoalAmount !== null
      ? remainingAfterExpenses - savingsGoalAmount
      : null;

  const emergencyMonthlyExpenses = hasEmergencyInput
    ? (parseOptionalNumber(emergencyInputs.monthlyExpenses) ?? monthlySpending)
    : null;
  const currentSavings = hasEmergencyInput
    ? parseOptionalNumber(emergencyInputs.currentSavings)
    : null;
  const targetMonths = hasEmergencyInput
    ? parseOptionalNumber(emergencyInputs.targetMonths) || 0
    : null;
  const monthlyContribution = hasEmergencyInput
    ? parseOptionalNumber(emergencyInputs.monthlyContribution)
    : null;
  const emergencyTarget =
    emergencyMonthlyExpenses !== null && targetMonths !== null
      ? emergencyMonthlyExpenses * targetMonths
      : null;
  const emergencyRemaining =
    emergencyTarget !== null && currentSavings !== null
      ? Math.max(emergencyTarget - currentSavings, 0)
      : null;
  const monthsToEmergencyGoal =
    emergencyRemaining !== null && monthlyContribution > 0
      ? Math.ceil(emergencyRemaining / monthlyContribution)
      : null;

  return {
    budget: hasBudgetInput
      ? {
          monthlyIncome,
          monthlySpending: Number(monthlySpending.toFixed(2)),
          savingsGoalPercent,
          savingsGoalAmount: roundOptional(savingsGoalAmount),
          remainingAfterExpenses: roundOptional(remainingAfterExpenses),
          remainingAfterSavingsGoal: roundOptional(remainingAfterSavingsGoal),
        }
      : null,
    emergencyFund: hasEmergencyInput
      ? {
          monthlyExpenses: roundOptional(emergencyMonthlyExpenses),
          currentSavings,
          targetMonths,
          monthlyContribution,
          targetAmount: roundOptional(emergencyTarget),
          remainingAmount: roundOptional(emergencyRemaining),
          monthsToGoal: monthsToEmergencyGoal,
        }
      : null,
  };
}

function parseOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function roundOptional(value) {
  return value === null ? null : Number(value.toFixed(2));
}

function buildSummary(expenses) {
  const categoryTotals = {};
  const monthlyTotals = {};
  let total = 0;

  for (const expense of expenses) {
    total += expense.amount;
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
    const month = expense.date.slice(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
  }

  const highestCategoryEntry = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return {
    total,
    categoryTotals,
    monthlyTotals,
    highestCategory: highestCategoryEntry
      ? { name: highestCategoryEntry[0], amount: highestCategoryEntry[1] }
      : { name: "None", amount: 0 },
  };
}
