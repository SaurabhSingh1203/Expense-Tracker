import { useMemo } from "react";
export default function BudgetCalculator({
  monthlySpending,
  budgetInputs,
  onBudgetChange
}) {
  const budget = useMemo(() => {
    const monthlyIncome = Number(budgetInputs.income) || 0;
    const goalPercent = Number(budgetInputs.savingsGoal) || 0;
    const goalAmount = monthlyIncome * (goalPercent / 100);
    const remainingAfterExpenses = monthlyIncome - monthlySpending;
    const remainingAfterGoal = monthlyIncome - monthlySpending - goalAmount;
    const needs = monthlyIncome * 0.5;
    const wants = monthlyIncome * 0.3;
    const savings = monthlyIncome * 0.2;

    return {
      goalAmount,
      remainingAfterExpenses,
      remainingAfterGoal,
      needs,
      wants,
      savings
    };
  }, [budgetInputs, monthlySpending]);

  return (
    <section className="panel calculator-panel">
      <div>
        <h2>Budget Calculator</h2>
        <p className="muted">Compare monthly income with spending and savings targets.</p>
      </div>

      <div className="calculator-form">
        <label>
          Monthly income
          <input
            type="number"
            min="0"
            step="0.01"
            value={budgetInputs.income}
            onChange={(event) => onBudgetChange({ ...budgetInputs, income: event.target.value })}
            placeholder="3500"
          />
        </label>
        <label>
          Savings goal %
          <input
            type="number"
            min="0"
            max="100"
            value={budgetInputs.savingsGoal}
            onChange={(event) => onBudgetChange({ ...budgetInputs, savingsGoal: event.target.value })}
          />
        </label>
      </div>

      <div className="calculator-results">
        <Result label="This month's spending" value={monthlySpending} />
        <Result label="Savings goal" value={budget.goalAmount} />
        <Result label="Left after spending" value={budget.remainingAfterExpenses} />
        <Result label="Left after goal" value={budget.remainingAfterGoal} />
      </div>

      <div className="budget-rule">
        <span>50/30/20 guide</span>
        <div>
          <strong>Needs ${budget.needs.toFixed(2)}</strong>
          <strong>Wants ${budget.wants.toFixed(2)}</strong>
          <strong>Savings ${budget.savings.toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}

function Result({ label, value }) {
  const isNegative = value < 0;

  return (
    <div className={isNegative ? "result negative" : "result"}>
      <span>{label}</span>
      <strong>${value.toFixed(2)}</strong>
    </div>
  );
}
