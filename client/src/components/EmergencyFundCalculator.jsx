import { useMemo } from "react";
export default function EmergencyFundCalculator({
  estimatedMonthlyExpenses,
  emergencyInputs,
  onEmergencyChange
}) {
  const result = useMemo(() => {
    const expenses = Number(emergencyInputs.monthlyExpenses) || estimatedMonthlyExpenses || 0;
    const saved = Number(emergencyInputs.currentSavings) || 0;
    const months = Number(emergencyInputs.targetMonths) || 0;
    const contribution = Number(emergencyInputs.monthlyContribution) || 0;
    const target = expenses * months;
    const remaining = Math.max(target - saved, 0);
    const monthsToGoal = contribution > 0 ? Math.ceil(remaining / contribution) : 0;

    return {
      expenses,
      target,
      remaining,
      monthsToGoal
    };
  }, [emergencyInputs, estimatedMonthlyExpenses]);

  return (
    <section className="panel calculator-panel">
      <div>
        <h2>Emergency Fund Calculator</h2>
        <p className="muted">Estimate how much to save for a basic emergency cushion.</p>
      </div>

      <div className="calculator-form emergency-form">
        <label>
          Monthly expenses
          <input
            type="number"
            min="0"
            step="0.01"
            value={emergencyInputs.monthlyExpenses}
            onChange={(event) =>
              onEmergencyChange({ ...emergencyInputs, monthlyExpenses: event.target.value })
            }
            placeholder={estimatedMonthlyExpenses ? estimatedMonthlyExpenses.toFixed(2) : "2500"}
          />
        </label>
        <label>
          Current savings
          <input
            type="number"
            min="0"
            step="0.01"
            value={emergencyInputs.currentSavings}
            onChange={(event) =>
              onEmergencyChange({ ...emergencyInputs, currentSavings: event.target.value })
            }
            placeholder="1000"
          />
        </label>
        <label>
          Target months
          <input
            type="number"
            min="1"
            max="12"
            value={emergencyInputs.targetMonths}
            onChange={(event) =>
              onEmergencyChange({ ...emergencyInputs, targetMonths: event.target.value })
            }
          />
        </label>
        <label>
          Monthly contribution
          <input
            type="number"
            min="0"
            step="0.01"
            value={emergencyInputs.monthlyContribution}
            onChange={(event) =>
              onEmergencyChange({ ...emergencyInputs, monthlyContribution: event.target.value })
            }
          />
        </label>
      </div>

      <div className="calculator-results">
        <Result label="Target fund" value={result.target} />
        <Result label="Still needed" value={result.remaining} />
        <div className="result">
          <span>Time to goal</span>
          <strong>{result.remaining === 0 ? "Ready" : `${result.monthsToGoal || "-"} mo`}</strong>
        </div>
      </div>
    </section>
  );
}

function Result({ label, value }) {
  return (
    <div className="result">
      <span>{label}</span>
      <strong>${value.toFixed(2)}</strong>
    </div>
  );
}
